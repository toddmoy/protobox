import React, { useMemo } from 'react'
import { MoreHorizontal, X, Clock, Tag } from 'lucide-react'
import clsx from 'clsx'
import { faker } from '@faker-js/faker'

const Avatar = ({ name, className }: { name: string; className?: string }) => (
  <div
    className={clsx(
      'bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-medium',
      className
    )}
  >
    {name.charAt(0)}
  </div>
)

const Badge = ({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'orange' | 'status'
  className?: string
}) => {
  const baseClasses =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border'

  const variants = {
    default:
      'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    orange:
      'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    status:
      'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
  }

  return <span className={clsx(baseClasses, variants[variant], className)}>{children}</span>
}

export default function MCP() {
  // Generate random content that changes on each render
  const randomContent = useMemo(() => {
    const taskNumber = faker.number.int({ min: 1000, max: 9999 })
    const assigneeName = faker.person.firstName()

    // Generate random task title (mix of different types)
    const taskTypes = [
      () => `${faker.hacker.verb()} ${faker.hacker.noun()} in ${faker.company.buzzNoun()}`,
      () => `Fix ${faker.lorem.words(2)} ${faker.hacker.abbreviation()} integration`,
      () => `Update ${faker.commerce.product()} ${faker.lorem.word()} configuration`,
      () => `Implement ${faker.lorem.words(3)} feature for ${faker.commerce.department()}`,
      () => `${faker.lorem.words({ min: 4, max: 8 })} and ${faker.lorem.words({ min: 2, max: 4 })}`,
      () => `Refactor ${faker.hacker.noun()} API endpoint validation`,
      () => `${faker.lorem.sentence().replace('.', '')}`,
    ]
    const taskTitle = faker.helpers.arrayElement(taskTypes)()

    // Generate random paragraphs (1-6 paragraphs)
    const paragraphCount = faker.number.int({ min: 1, max: 6 })
    const bodyContent = Array.from({ length: paragraphCount }, () =>
      faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), '\n\n')
    )

    // Generate random labels
    const labelTypes = [
      'Bug',
      'Feature',
      'Enhancement',
      'Documentation',
      'Refactor',
      'Test',
      'Hotfix',
      'Performance',
    ]
    const priorities = ['P0', 'P1', 'P2', 'P3', 'Critical', 'High', 'Medium', 'Low']
    const sprints = Array.from({ length: 50 }, (_, i) => `Sprint ${i + 1}`)
    const departments = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'Design', 'QA', 'Security']
    const customLabels = [
      'Customer facing',
      'Internal',
      'API',
      'UI/UX',
      'Database',
      'Security',
      'Performance',
      'Analytics',
      'Integration',
      'Migration',
      'Cleanup',
    ]

    const allLabelOptions = [
      ...labelTypes,
      ...priorities,
      ...sprints,
      ...departments.map(d => `#${d}`),
      ...customLabels.map(l => `#${l}`),
    ]

    // Pick 2-6 random labels
    const labelCount = faker.number.int({ min: 2, max: 6 })
    const selectedLabels = faker.helpers.arrayElements(allLabelOptions, labelCount)

    return {
      taskNumber,
      assigneeName,
      taskTitle,
      bodyContent,
      labels: selectedLabels,
    }
  }, []) // Empty dependency array means this only runs once per component mount

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-4 h-4 bg-teal-500 dark:bg-teal-400 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white dark:bg-neutral-900 rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Polish
            </span>
          </div>
          <span className="text-neutral-400 dark:text-neutral-500 text-sm">/</span>
          <div className="flex items-center gap-1.5 px-2 py-1">
            <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              #{randomContent.taskNumber}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
            <MoreHorizontal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-10 space-y-10">
        {/* Title Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              #{randomContent.taskNumber}
            </div>
            <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 leading-tight">
              {randomContent.taskTitle}
            </h1>
          </div>

          {/* Status Pills */}
          <div className="flex gap-3">
            <Badge variant="status" className="justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span className="truncate">In progress</span>
            </Badge>
            <Badge variant="status" className="justify-center flex-shrink-0">
              <Avatar name={randomContent.assigneeName} className="w-4 h-4 text-xs flex-shrink-0" />
              <span className="truncate">{randomContent.assigneeName}</span>
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-3">
          {randomContent.bodyContent.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <div className="flex items-center gap-2 flex-wrap">
            {randomContent.labels.map((label, index) => (
              <Badge
                key={index}
                variant="orange"
                className={index === 0 ? 'bg-orange-100 dark:bg-orange-900' : ''}
              >
                {index === 0 && (
                  <div className="w-3 h-3">
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
                      <path
                        d="M12 3V2.25H10.5V3C10.5 3.45 10.2 3.75 9.75 3.75H9C8.775 3.45 8.55 3.225 8.25 3V2.25C8.25 0.975 7.275 0 6 0C4.725 0 3.75 0.975 3.75 2.25V3C3.45 3.225 3.225 3.45 3 3.75H2.25C1.8 3.75 1.5 3.45 1.5 3V2.25H0V3C0 4.275 0.975 5.25 2.25 5.25H2.325C2.25 5.475 2.25 5.775 2.25 6H0V7.5H2.25V8.25C0.975 8.25 0 9.225 0 10.5V11.25H1.5V10.5C1.5 10.05 1.8 9.75 2.25 9.75H2.55C3.15 11.1 4.5 12 6 12C7.5 12 8.85 11.1 9.45 9.75H9.75C10.2 9.75 10.5 10.05 10.5 10.5V11.25H12V10.5C12 9.225 11.025 8.25 9.75 8.25V7.5H12V6H9.75C9.75 5.775 9.75 5.475 9.675 5.25H9.75C11.025 5.25 12 4.275 12 3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-neutral-800 dark:bg-neutral-600"></div>
      </div>
    </div>
  )
}
