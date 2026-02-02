import { PrismaClient, Role, TaskStatus, Priority, Severity, BugStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.bug.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  // Create team
  const team = await prisma.team.create({
    data: {
      name: 'SprintOps Demo Team',
    },
  });

  console.log('Created team:', team.name);

  // Create demo users
  const passwordHash = await bcrypt.hash('sprintops123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'demo@sprintops.com',
      passwordHash,
      name: 'Alex Chen',
      role: Role.ADMIN,
      teamId: team.id,
    },
  });

  const member1 = await prisma.user.create({
    data: {
      email: 'sarah@sprintops.com',
      passwordHash,
      name: 'Sarah Miller',
      role: Role.MEMBER,
      teamId: team.id,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: 'james@sprintops.com',
      passwordHash,
      name: 'James Wilson',
      role: Role.MEMBER,
      teamId: team.id,
    },
  });

  const member3 = await prisma.user.create({
    data: {
      email: 'emma@sprintops.com',
      passwordHash,
      name: 'Emma Davis',
      role: Role.MEMBER,
      teamId: team.id,
    },
  });

  console.log('Created users:', [adminUser.name, member1.name, member2.name, member3.name].join(', '));

  // Create tasks with varied statuses and dates
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const tasks = await Promise.all([
    // Done tasks (completed over past week)
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        teamId: team.id,
        assignedToId: member2.id,
        createdAt: new Date(now.getTime() - 7 * dayMs),
        updatedAt: new Date(now.getTime() - 5 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design system documentation',
        description: 'Document color palette, typography, and component library',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member1.id,
        createdAt: new Date(now.getTime() - 6 * dayMs),
        updatedAt: new Date(now.getTime() - 4 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'User authentication flow',
        description: 'Implement login, signup, and password reset',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        teamId: team.id,
        assignedToId: adminUser.id,
        createdAt: new Date(now.getTime() - 10 * dayMs),
        updatedAt: new Date(now.getTime() - 6 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Database schema design',
        description: 'Design and implement Prisma schema for all entities',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        teamId: team.id,
        assignedToId: adminUser.id,
        createdAt: new Date(now.getTime() - 12 * dayMs),
        updatedAt: new Date(now.getTime() - 8 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Landing page copy',
        description: 'Write compelling copy for the marketing landing page',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member3.id,
        createdAt: new Date(now.getTime() - 5 * dayMs),
        updatedAt: new Date(now.getTime() - 3 * dayMs),
      },
    }),

    // In Progress tasks
    prisma.task.create({
      data: {
        title: 'Analytics dashboard charts',
        description: 'Build interactive charts for sprint velocity and completion rates',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        teamId: team.id,
        assignedToId: member1.id,
        dueDate: new Date(now.getTime() + 2 * dayMs),
        createdAt: new Date(now.getTime() - 3 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'API rate limiting',
        description: 'Implement rate limiting middleware for all API endpoints',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member2.id,
        dueDate: new Date(now.getTime() + 3 * dayMs),
        createdAt: new Date(now.getTime() - 2 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Email notification system',
        description: 'Set up transactional emails for task assignments and blockers',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member3.id,
        dueDate: new Date(now.getTime() + 4 * dayMs),
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    }),

    // Blocked tasks
    prisma.task.create({
      data: {
        title: 'Payment integration',
        description: 'Integrate Stripe for subscription billing',
        status: TaskStatus.BLOCKED,
        priority: Priority.HIGH,
        teamId: team.id,
        assignedToId: adminUser.id,
        blockReason: 'Waiting for Stripe account approval',
        blockedAt: new Date(now.getTime() - 2 * dayMs),
        dueDate: new Date(now.getTime() + 5 * dayMs),
        createdAt: new Date(now.getTime() - 4 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Mobile responsive redesign',
        description: 'Optimize all pages for mobile devices',
        status: TaskStatus.BLOCKED,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member1.id,
        blockReason: 'Waiting for updated design specs from designer',
        blockedAt: new Date(now.getTime() - 1 * dayMs),
        dueDate: new Date(now.getTime() + 7 * dayMs),
        createdAt: new Date(now.getTime() - 3 * dayMs),
      },
    }),

    // Todo tasks
    prisma.task.create({
      data: {
        title: 'Performance optimization',
        description: 'Profile and optimize slow database queries',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        teamId: team.id,
        assignedToId: member2.id,
        dueDate: new Date(now.getTime() + 10 * dayMs),
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'User onboarding flow',
        description: 'Create guided tour for new users',
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        teamId: team.id,
        assignedToId: member3.id,
        dueDate: new Date(now.getTime() + 14 * dayMs),
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Export functionality',
        description: 'Allow users to export tasks and analytics as CSV/PDF',
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        teamId: team.id,
        assignedToId: null,
        dueDate: new Date(now.getTime() + 21 * dayMs),
        createdAt: now,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Dark mode support',
        description: 'Implement system-aware dark mode theme',
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        teamId: team.id,
        assignedToId: member1.id,
        dueDate: new Date(now.getTime() + 28 * dayMs),
        createdAt: now,
      },
    }),
  ]);

  console.log(`Created ${tasks.length} tasks`);

  // Get task references for linking bugs
  const paymentTask = tasks.find(t => t.title === 'Payment integration');
  const authTask = tasks.find(t => t.title === 'User authentication flow');
  const analyticsTask = tasks.find(t => t.title === 'Analytics dashboard charts');

  // Create bugs
  const bugs = await Promise.all([
    // Open bugs
    prisma.bug.create({
      data: {
        title: 'Login fails with special characters in password',
        description: 'Users with passwords containing & or < cannot log in. Appears to be an encoding issue.',
        severity: Severity.CRITICAL,
        status: BugStatus.OPEN,
        teamId: team.id,
        linkedTaskId: authTask?.id,
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    }),
    prisma.bug.create({
      data: {
        title: 'Dashboard charts not rendering on Safari',
        description: 'Recharts components throw hydration error on Safari 16+',
        severity: Severity.MEDIUM,
        status: BugStatus.OPEN,
        teamId: team.id,
        linkedTaskId: analyticsTask?.id,
        createdAt: new Date(now.getTime() - 2 * dayMs),
      },
    }),
    prisma.bug.create({
      data: {
        title: 'Task due date shows wrong timezone',
        description: 'Due dates display in UTC instead of user local timezone',
        severity: Severity.LOW,
        status: BugStatus.OPEN,
        teamId: team.id,
        createdAt: new Date(now.getTime() - 3 * dayMs),
      },
    }),
    prisma.bug.create({
      data: {
        title: 'Memory leak in real-time updates',
        description: 'WebSocket connections not properly cleaned up on page navigation',
        severity: Severity.MEDIUM,
        status: BugStatus.OPEN,
        teamId: team.id,
        createdAt: now,
      },
    }),

    // Fixed bugs
    prisma.bug.create({
      data: {
        title: 'Signup form allows duplicate emails',
        description: 'Email uniqueness constraint not enforced on frontend',
        severity: Severity.CRITICAL,
        status: BugStatus.FIXED,
        teamId: team.id,
        createdAt: new Date(now.getTime() - 7 * dayMs),
        updatedAt: new Date(now.getTime() - 5 * dayMs),
      },
    }),
    prisma.bug.create({
      data: {
        title: 'Task deletion not refreshing list',
        description: 'After deleting a task, the list doesnt update until page refresh',
        severity: Severity.MEDIUM,
        status: BugStatus.FIXED,
        teamId: team.id,
        createdAt: new Date(now.getTime() - 6 * dayMs),
        updatedAt: new Date(now.getTime() - 4 * dayMs),
      },
    }),
    prisma.bug.create({
      data: {
        title: 'CSS overflow on long task titles',
        description: 'Task cards break layout when title exceeds 100 characters',
        severity: Severity.LOW,
        status: BugStatus.FIXED,
        teamId: team.id,
        createdAt: new Date(now.getTime() - 8 * dayMs),
        updatedAt: new Date(now.getTime() - 6 * dayMs),
      },
    }),
  ]);

  console.log(`Created ${bugs.length} bugs`);

  console.log('\n--- Seeding complete! ---');
  console.log('\nDemo login credentials:');
  console.log('  Email: demo@sprintops.com');
  console.log('  Password: sprintops123');
  console.log('\nOther test accounts (same password):');
  console.log('  - sarah@sprintops.com (Member)');
  console.log('  - james@sprintops.com (Member)');
  console.log('  - emma@sprintops.com (Member)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
