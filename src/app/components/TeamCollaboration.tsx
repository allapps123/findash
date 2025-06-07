"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
  ShareIcon,
  UserPlusIcon,
  CogIcon,
  StarIcon,
  ChatBubbleOvalLeftIcon,
  FolderIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar: string;
  lastActive: Date;
  status: 'online' | 'away' | 'offline';
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  attachments?: string[];
  mentions?: string[];
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  isPublic: boolean;
  documents: number;
  comments: Comment[];
}

interface TeamCollaborationProps {
  currentUser?: {
    id: string;
    name: string;
    role: 'admin' | 'analyst' | 'viewer';
    organization: string;
  };
  onTeamUpdate?: (teamSize: number) => void;
}

export default function TeamCollaboration({ currentUser, onTeamUpdate }: TeamCollaborationProps) {
  const [activeTab, setActiveTab] = useState<'workspaces' | 'team' | 'comments' | 'permissions'>('workspaces');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'main-workspace',
      name: 'Q4 Financial Analysis',
      description: 'Collaborative analysis of Q4 financials across all portfolio companies',
      members: ['user-1', 'user-2', 'user-3'],
      createdBy: 'user-1',
      createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
      lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
      isPublic: false,
      documents: 12,
      comments: []
    },
    {
      id: 'demo-workspace',
      name: 'Demo Portfolio Review',
      description: 'Testing workspace for new team members and feature demonstrations',
      members: ['user-1', 'user-4'],
      createdBy: 'user-1',
      createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
      isPublic: true,
      documents: 5,
      comments: []
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<User[]>([
    {
      id: 'user-1',
      name: currentUser?.name || 'Sarah Chen',
      email: 'sarah@company.com',
      role: currentUser?.role || 'admin',
      avatar: '👩‍💼',
      lastActive: new Date(),
      status: 'online'
    },
    {
      id: 'user-2',
      name: 'Michael Rodriguez',
      email: 'michael@company.com',
      role: 'analyst',
      avatar: '👨‍💼',
      lastActive: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'online'
    },
    {
      id: 'user-3',
      name: 'Emily Johnson',
      email: 'emily@company.com',
      role: 'analyst',
      avatar: '👩‍🔬',
      lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'away'
    },
    {
      id: 'user-4',
      name: 'David Kim',
      email: 'david@company.com',
      role: 'viewer',
      avatar: '👨‍🎓',
      lastActive: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'offline'
    }
  ]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Update team count
  useEffect(() => {
    onTeamUpdate?.(teamMembers.length);
  }, [teamMembers, onTeamUpdate]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamMembers(prev => prev.map(member => {
        if (Math.random() < 0.1) {
          const statuses: User['status'][] = ['online', 'away', 'offline'];
          return {
            ...member,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastActive: member.status === 'online' ? new Date() : member.lastActive
          };
        }
        return member;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateWorkspace = useCallback((name: string, description: string, isPublic: boolean) => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      members: [currentUser?.id || 'user-1'],
      createdBy: currentUser?.id || 'user-1',
      createdAt: new Date(),
      lastActivity: new Date(),
      isPublic,
      documents: 0,
      comments: []
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setShowCreateWorkspace(false);
  }, [currentUser]);

  const handleInviteUser = useCallback((email: string, role: User['role']) => {
    // In a real app, this would send an invitation email
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      avatar: '👤',
      lastActive: new Date(),
      status: 'offline'
    };

    setTeamMembers(prev => [...prev, newUser]);
    setShowInviteDialog(false);
  }, []);

  const handleAddComment = useCallback((workspaceId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser?.id || 'user-1',
      content: newComment,
      timestamp: new Date(),
      resolved: false
    };

    setWorkspaces(prev => prev.map(workspace => 
      workspace.id === workspaceId 
        ? { 
            ...workspace, 
            comments: [...workspace.comments, comment],
            lastActivity: new Date()
          }
        : workspace
    ));

    setNewComment('');
  }, [newComment, currentUser]);

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'analyst': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const tabConfig = [
    {
      id: 'workspaces' as const,
      label: 'Workspaces',
      icon: FolderIcon,
      count: workspaces.length
    },
    {
      id: 'team' as const,
      label: 'Team Members',
      icon: UserGroupIcon,
      count: teamMembers.length
    },
    {
      id: 'comments' as const,
      label: 'Recent Comments',
      icon: ChatBubbleLeftRightIcon,
      count: workspaces.reduce((sum, w) => sum + w.comments.length, 0)
    },
    {
      id: 'permissions' as const,
      label: 'Permissions',
      icon: ShieldCheckIcon,
      count: 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Workspaces',
            value: workspaces.length,
            icon: FolderIcon,
            color: 'text-blue-600'
          },
          {
            label: 'Team Members',
            value: teamMembers.length,
            icon: UserGroupIcon,
            color: 'text-green-600'
          },
          {
            label: 'Online Now',
            value: teamMembers.filter(m => m.status === 'online').length,
            icon: BellIcon,
            color: 'text-purple-600'
          },
          {
            label: 'Recent Comments',
            value: workspaces.reduce((sum, w) => sum + w.comments.length, 0),
            icon: ChatBubbleOvalLeftIcon,
            color: 'text-orange-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {tabConfig.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'workspaces' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Shared Workspaces
                </h3>
                <motion.button
                  onClick={() => setShowCreateWorkspace(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-md"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Workspace
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workspaces.map((workspace) => (
                  <motion.div
                    key={workspace.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                    onClick={() => setSelectedWorkspace(workspace)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {workspace.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {workspace.description}
                        </p>
                      </div>
                      {workspace.isPublic ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <ShareIcon className="h-3 w-3 mr-1" />
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          Private
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {workspace.members.slice(0, 4).map((memberId) => {
                          const member = teamMembers.find(m => m.id === memberId);
                          return member ? (
                            <div
                              key={member.id}
                              className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-gray-800"
                              title={member.name}
                            >
                              {member.avatar}
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                            </div>
                          ) : null;
                        })}
                        {workspace.members.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                            +{workspace.members.length - 4}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {workspace.documents} documents
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatLastActive(workspace.lastActivity)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Team Members
                </h3>
                <motion.button
                  onClick={() => setShowInviteDialog(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-md"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Invite Member
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium">
                          {member.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {member.name}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {member.email}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Last active: {formatLastActive(member.lastActive)}
                          </span>
                          <span className={`capitalize font-medium ${
                            member.status === 'online' ? 'text-green-600' :
                            member.status === 'away' ? 'text-yellow-600' : 'text-gray-400'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Comments & Discussions
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {currentUser?.name.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or ask a question..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Use @username to mention team members
                        </div>
                        <motion.button
                          onClick={() => handleAddComment('main-workspace')}
                          disabled={!newComment.trim()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {workspaces.flatMap(w => w.comments).length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-3" />
                      <p>No comments yet</p>
                      <p className="text-sm">Start a discussion about your analysis</p>
                    </div>
                  ) : (
                    <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {workspaces.flatMap(w => w.comments).map((comment) => {
                        const author = teamMembers.find(m => m.id === comment.userId);
                        return (
                          <div key={comment.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                              {author?.avatar || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {author?.name || 'Unknown User'}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatLastActive(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Role-Based Permissions
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  {
                    role: 'Admin',
                    description: 'Full access to all features and settings',
                    permissions: [
                      'Create and delete workspaces',
                      'Invite and remove team members',
                      'Manage integrations and billing',
                      'Export all reports and data',
                      'Configure security settings'
                    ],
                    color: 'from-purple-500 to-purple-600',
                    count: teamMembers.filter(m => m.role === 'admin').length
                  },
                  {
                    role: 'Analyst',
                    description: 'Advanced analysis and collaboration features',
                    permissions: [
                      'Create and edit analysis',
                      'Collaborate in workspaces',
                      'Comment and annotate',
                      'Export reports',
                      'View all team activities'
                    ],
                    color: 'from-blue-500 to-blue-600',
                    count: teamMembers.filter(m => m.role === 'analyst').length
                  },
                  {
                    role: 'Viewer',
                    description: 'Read-only access to shared content',
                    permissions: [
                      'View shared workspaces',
                      'Read comments and discussions',
                      'Download permitted reports',
                      'Basic chart interactions',
                      'Personal dashboard access'
                    ],
                    color: 'from-gray-500 to-gray-600',
                    count: teamMembers.filter(m => m.role === 'viewer').length
                  }
                ].map((roleInfo) => (
                  <motion.div
                    key={roleInfo.role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${roleInfo.color} rounded-xl shadow-lg`}>
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {roleInfo.count}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {roleInfo.role}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {roleInfo.description}
                    </p>

                    <div className="space-y-2">
                      {roleInfo.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Invite Dialog */}
      <AnimatePresence>
        {showInviteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Invite Team Member
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleInviteUser(
                  formData.get('email') as string,
                  formData.get('role') as User['role']
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="colleague@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue="analyst"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => setShowInviteDialog(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg"
                  >
                    Send Invite
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 