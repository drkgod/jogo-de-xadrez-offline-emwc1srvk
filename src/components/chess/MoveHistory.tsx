import React from 'react'
import { MoveRecord } from '@/lib/chess/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History } from 'lucide-react'

interface MoveHistoryProps {
  history: MoveRecord[]
}

export function MoveHistory({ history }: MoveHistoryProps) {
  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({ w: history[i], b: history[i + 1] })
  }

  return (
    <Card className="flex-1 flex flex-col bg-slate-900 border-slate-800 text-slate-100 overflow-hidden max-h-[400px] lg:max-h-full">
      <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-900/80 shrink-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-200">
          <History className="w-4 h-4" />
          Histórico de Jogadas
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-1.5 text-sm">
          {pairs.length === 0 && (
            <div className="col-span-3 text-center text-slate-500 py-4 italic">
              Nenhuma jogada realizada.
            </div>
          )}
          {pairs.map((pair, i) => (
            <React.Fragment key={i}>
              <div className="text-slate-500 font-mono text-right pr-2">{i + 1}.</div>
              <div className="font-medium text-slate-300">{pair.w.san}</div>
              <div className="font-medium text-slate-300">{pair.b?.san || ''}</div>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
