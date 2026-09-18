import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Lead from "../models/lead.model.js";
import Business from "../models/business.model.js";
import AppError from "../utils/AppError.js";

const MANAGEABLE_ROLES = new Set(["admin", "sales"]);

const getBusiness = async (businessId) => {
  if (!businessId) {
    throw new AppError("Business is required", 401);
  }

  const business = await Business.findOne({
    _id: businessId,
    isActive: true,
  })
    .select("_id owner")
    .lean();

  if (!business) {
    throw new AppError("Business account was not found", 404);
  }

  return business;
};

const assertCanManageTeam = (role) => {
  if (role !== "owner" && role !== "admin") {
    throw new AppError(
      "You do not have permission to manage team members",
      403,
    );
  }
};

const assertManageableRole = (role) => {
  if (!MANAGEABLE_ROLES.has(role)) {
    throw new AppError("This role cannot be assigned to a team member", 400);
  }
};

const assertOwnerAccess = (business, actorUserId) => {
  if (business.owner.toString() !== actorUserId) {
    throw new AppError(
      "You do not have permission to manage this workspace",
      403,
    );
  }
};

const assertCanAssignRole = (actorRole, targetRole) => {
  assertManageableRole(targetRole);

  if (actorRole === "admin" && targetRole === "admin") {
    throw new AppError("Only the workspace owner can assign admin access", 403);
  }
};

const assertCanModifyMember = (actorRole, memberRole) => {
  if (memberRole === "owner") {
    throw new AppError("The workspace owner cannot be modified here", 403);
  }

  if (actorRole === "admin" && memberRole === "admin") {
    throw new AppError(
      "Only the workspace owner can modify an admin member",
      403,
    );
  }
};

const getAssignedLeadCounts = async (businessId, userIds) => {
  if (!userIds.length) {
    return new Map();
  }

  const results = await Lead.aggregate([
    {
      $match: {
        businessId,
        assignedTo: {
          $in: userIds,
        },
      },
    },
    {
      $group: {
        _id: "$assignedTo",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  return new Map(results.map((item) => [item._id.toString(), item.count]));
};

const getMemberResponse = (member, assignedLeads = 0) => ({
  id: member._id,
  name: member.name,
  email: member.email,
  avatar: member.avatar,
  role: member.role,
  status: member.isActive ? "active" : "inactive",
  assignedLeads,
  createdAt: member.createdAt,
});

export const getTeamMembers = async (userId, businessId, role) => {
  assertCanManageTeam(role);

  const business = await getBusiness(businessId);

  if (role === "owner") {
    assertOwnerAccess(business, userId);
  }

  const members = await User.find({
    businessId,
  })
    .select("_id name email role avatar isActive createdAt")
    .lean();

  const roleOrder = {
    owner: 0,
    admin: 1,
    sales: 2,
  };

  members.sort((a, b) => {
    const roleDifference = roleOrder[a.role] - roleOrder[b.role];

    if (roleDifference !== 0) {
      return roleDifference;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const memberIds = members.map((member) => member._id);

  const assignedLeadCounts = await getAssignedLeadCounts(businessId, memberIds);

  return members.map((member) =>
    getMemberResponse(
      member,
      assignedLeadCounts.get(member._id.toString()) || 0,
    ),
  );
};

export const inviteTeamMember = async ({
  actorUserId,
  actorRole,
  businessId,
  name,
  email,
  password,
  role,
}) => {
  assertCanManageTeam(actorRole);

  const business = await getBusiness(businessId);

  if (actorRole === "owner") {
    assertOwnerAccess(business, actorUserId);
  }

  assertCanAssignRole(actorRole, role);

  const existingUser = await User.findOne({
    email,
  }).lean();

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const member = await User.create({
    name,
    email,
    password: passwordHash,
    role,
    businessId,
    tokenVersion: 0,
    isActive: true,
  });

  return getMemberResponse(member, 0);
};

export const updateTeamMember = async ({
  actorUserId,
  actorRole,
  businessId,
  memberId,
  name,
  role,
  isActive,
}) => {
  assertCanManageTeam(actorRole);

  const business = await getBusiness(businessId);

  if (actorRole === "owner") {
    assertOwnerAccess(business, actorUserId);
  }

  if (
    actorUserId === memberId &&
    (role !== undefined || isActive !== undefined)
  ) {
    throw new AppError("You cannot change your own team role or status", 400);
  }

  const member = await User.findOne({
    _id: memberId,
    businessId,
  });

  if (!member) {
    throw new AppError("Team member was not found", 404);
  }

  assertCanModifyMember(actorRole, member.role);

  if (role !== undefined) {
    assertCanAssignRole(actorRole, role);
  }

  if (name !== undefined) {
    member.name = name;
  }

  if (role !== undefined) {
    const roleChanged = member.role !== role;

    member.role = role;

    if (roleChanged) {
      member.tokenVersion += 1;
    }
  }

  if (isActive !== undefined) {
    const statusChanged = member.isActive !== isActive;

    member.isActive = isActive;

    if (statusChanged && !isActive) {
      member.tokenVersion += 1;
    }
  }

  await member.save();

  const assignedLeadCount = await Lead.countDocuments({
    businessId,
    assignedTo: member._id,
  });

  return getMemberResponse(member, assignedLeadCount);
};

export const removeTeamMember = async ({
  actorUserId,
  actorRole,
  businessId,
  memberId,
}) => {
  if (actorRole !== "owner") {
    throw new AppError("Only the workspace owner can remove team members", 403);
  }

  const business = await getBusiness(businessId);

  assertOwnerAccess(business, actorUserId);

  if (actorUserId === memberId) {
    throw new AppError("You cannot remove yourself from the workspace", 400);
  }

  const member = await User.findOne({
    _id: memberId,
    businessId,
  });

  if (!member) {
    throw new AppError("Team member was not found", 404);
  }

  if (member.role === "owner") {
    throw new AppError("The workspace owner cannot be removed", 403);
  }

  const assignedLeadCount = await Lead.countDocuments({
    businessId,
    assignedTo: member._id,
  });

  if (assignedLeadCount > 0) {
    throw new AppError(
      "This member still has assigned leads. Reassign the leads before removing the member.",
      409,
    );
  }

  await User.deleteOne({
    _id: member._id,
    businessId,
  });

  return {
    id: member._id,
  };
};
