import { useState, useMemo } from 'react'
import { highlight } from '@oxog/codeshine'
import { Copy, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  highlightLines?: (number | string)[]
  showLineNumbers?: boolean
  showCopyButton?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language,
  filename,
  highlightLines,
  showLineNumbers = true,
  showCopyButton = true,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()

  const codeTheme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Memoize the highlighted HTML to avoid re-highlighting on every render
  const html = useMemo(() => {
    return highlight(code.trim(), {
      language,
      theme: codeTheme,
      lineNumbers: showLineNumbers,
      highlightLines,
    })
  }, [code, language, codeTheme, showLineNumbers, highlightLines])

  return (
    <div className={cn(
      'my-6 rounded-lg border overflow-hidden',
      'border-border/60 dark:border-border/40',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 dark:bg-muted/10 border-b border-border">
        <div className="flex items-center gap-2.5">
          {/* macOS dots */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-xs text-muted-foreground font-mono">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-medium text-muted-foreground">
            {language}
          </span>
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="text-green-500 text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code - highlight() returns complete <pre> element with inline styles */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
