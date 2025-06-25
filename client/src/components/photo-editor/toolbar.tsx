import { Button } from "@/components/ui/button";
import { Undo, Redo, ZoomIn, ZoomOut, Check, Loader2 } from "lucide-react";

interface ToolbarProps {
  onApplyChanges: () => void;
  isProcessing: boolean;
  hasChanges: boolean;
}

export function Toolbar({ onApplyChanges, isProcessing, hasChanges }: ToolbarProps) {
  return (
    <div className="panel-dark border-t border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" className="hover-dark">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="hover-dark">
            <Redo className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-gray-700"></div>
          <Button variant="secondary" size="sm" className="hover-dark">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="hover-dark">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400">100%</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-purple-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
          
          <Button
            onClick={onApplyChanges}
            disabled={!hasChanges || isProcessing}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white transition-all flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
