import { Target, ArrowRightCircle, Cpu, FileCheck } from 'lucide-react';

export interface WorkflowInstructionProps {
  task: string;
  input: string;
  response: string;
  output: string;
}

export const WorkflowInstructionStrip: React.FC<WorkflowInstructionProps> = ({
  task,
  input,
  response,
  output,
}) => {
  return (
    <div
      role="region"
      aria-label="Workflow Guide"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-divider)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        boxShadow: 'var(--shadow-xs)',
        alignItems: 'stretch',
      }}
    >
      {/* 1. YOUR TASK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={13} color="var(--accent-primary)" />
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--accent-primary)',
          }}>
            Your Task
          </span>
        </div>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          {task}
        </p>
      </div>

      {/* 2. YOUR INPUT */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowRightCircle size={13} color="var(--text-secondary)" />
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
          }}>
            Your Input
          </span>
        </div>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
          margin: 0,
        }}>
          {input}
        </p>
      </div>

      {/* 3. BATTERYLOOP'S RESPONSE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={13} color="var(--text-secondary)" />
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)',
          }}>
            System Response
          </span>
        </div>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
          margin: 0,
        }}>
          {response}
        </p>
      </div>

      {/* 4. YOUR OUTPUT */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        borderLeft: '1px solid var(--border-subtle)',
        paddingLeft: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileCheck size={13} color="var(--accent-primary)" />
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--accent-primary)',
          }}>
            Your Output
          </span>
        </div>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          {output}
        </p>
      </div>
    </div>
  );
};
