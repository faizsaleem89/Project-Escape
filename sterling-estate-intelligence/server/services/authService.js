/**
 * Enterprise Authentication & User Management Service
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * User Authentication
 */
export const authService = {
  /**
   * Hash password
   */
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  /**
   * Verify password
   */
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  /**
   * Create user
   */
  async createUser(userData) {
    const hashedPassword = await this.hashPassword(userData.password);

    return {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name,
      company: userData.company,
      role: userData.role || 'user',
      passwordHash: hashedPassword,
      createdAt: new Date(),
      status: 'active',
    };
  },

  /**
   * Login user
   */
  async loginUser(email, password, users) {
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const passwordValid = await this.verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = this.generateToken(user);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role,
      },
    };
  },
};

/**
 * Role-Based Access Control
 */
export const rbacService = {
  roles: {
    admin: {
      permissions: [
        'view_all_properties',
        'edit_properties',
        'delete_properties',
        'manage_users',
        'manage_teams',
        'view_analytics',
        'export_data',
        'manage_integrations',
      ],
    },
    manager: {
      permissions: [
        'view_all_properties',
        'edit_properties',
        'manage_team_members',
        'view_team_analytics',
        'create_reports',
        'export_data',
      ],
    },
    analyst: {
      permissions: [
        'view_assigned_properties',
        'create_analysis',
        'create_reports',
        'view_analytics',
        'export_assigned_data',
      ],
    },
    viewer: {
      permissions: [
        'view_assigned_properties',
        'view_reports',
      ],
    },
  },

  /**
   * Check if user has permission
   */
  hasPermission(userRole, permission) {
    const role = this.roles[userRole];
    return role && role.permissions.includes(permission);
  },

  /**
   * Get user permissions
   */
  getPermissions(userRole) {
    const role = this.roles[userRole];
    return role ? role.permissions : [];
  },
};

/**
 * Team Management
 */
export const teamService = {
  /**
   * Create team
   */
  createTeam(teamData) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: teamData.name,
      company: teamData.company,
      owner: teamData.owner,
      members: [teamData.owner],
      createdAt: new Date(),
      settings: {
        dataSharing: 'team',
        reportAccess: 'team',
        analytics: 'team',
      },
    };
  },

  /**
   * Add team member
   */
  addTeamMember(team, userId, role) {
    return {
      ...team,
      members: [...team.members, userId],
      memberRoles: {
        ...team.memberRoles,
        [userId]: role,
      },
    };
  },

  /**
   * Remove team member
   */
  removeTeamMember(team, userId) {
    return {
      ...team,
      members: team.members.filter(m => m !== userId),
      memberRoles: Object.fromEntries(
        Object.entries(team.memberRoles).filter(([key]) => key !== userId)
      ),
    };
  },

  /**
   * Update team settings
   */
  updateTeamSettings(team, settings) {
    return {
      ...team,
      settings: { ...team.settings, ...settings },
    };
  },
};

/**
 * Collaboration Features
 */
export const collaborationService = {
  /**
   * Create shared workspace
   */
  createWorkspace(workspaceData) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: workspaceData.name,
      owner: workspaceData.owner,
      team: workspaceData.team,
      properties: [],
      analyses: [],
      reports: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        edit: [workspaceData.owner],
        view: workspaceData.team,
        comment: workspaceData.team,
      },
    };
  },

  /**
   * Add property to workspace
   */
  addPropertyToWorkspace(workspace, propertyId) {
    return {
      ...workspace,
      properties: [...new Set([...workspace.properties, propertyId])],
      updatedAt: new Date(),
    };
  },

  /**
   * Share analysis with team
   */
  shareAnalysis(analysis, teamMembers) {
    return {
      ...analysis,
      sharedWith: teamMembers,
      sharedAt: new Date(),
      accessLevel: 'view',
    };
  },

  /**
   * Create comment/note
   */
  createComment(propertyId, userId, comment) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      propertyId,
      userId,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

/**
 * CRM Integration
 */
export const crmService = {
  /**
   * Sync with Salesforce
   */
  async syncSalesforce(properties, crmConfig) {
    return {
      status: 'syncing',
      recordsToSync: properties.length,
      syncedAt: new Date(),
      config: {
        apiUrl: crmConfig.apiUrl,
        objectType: 'Opportunity',
        fieldMapping: {
          address: 'Name',
          price: 'Amount',
          gdv: 'Expected_Revenue__c',
          profitPotential: 'Profit_Potential__c',
        },
      },
    };
  },

  /**
   * Sync with HubSpot
   */
  async syncHubSpot(properties, crmConfig) {
    return {
      status: 'syncing',
      recordsToSync: properties.length,
      syncedAt: new Date(),
      config: {
        apiUrl: 'https://api.hubapi.com',
        objectType: 'deals',
        fieldMapping: {
          address: 'dealname',
          price: 'amount',
          gdv: 'expected_revenue',
        },
      },
    };
  },

  /**
   * Create CRM deal
   */
  createDeal(property, crmType) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      crmType,
      property: property.address,
      value: property.gdv,
      stage: 'Prospect',
      createdAt: new Date(),
      syncStatus: 'pending',
    };
  },
};

export default {
  authService,
  rbacService,
  teamService,
  collaborationService,
  crmService,
};
