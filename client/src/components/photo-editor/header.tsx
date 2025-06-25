import { Button } from "@/components/ui/button";
import { Download, History } from "lucide-react";

interface HeaderProps {
  onDownload: () => void;
  hasImage: boolean;
}

export function Header({ onDownload, hasImage }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 panel-dark border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-button rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">AI Photo Enhancer</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="secondary" className="hover-dark">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
        <Button 
          onClick={onDownload}
          disabled={!hasImage}
          className="gradient-button hover:gradient-button text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </header>
  );
}
