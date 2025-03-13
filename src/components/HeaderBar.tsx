import React from "react";
import ButtonProps from "./ButtonProps";
import { RiAddLine } from "react-icons/ri";

interface HeaderBarProps {
  title: string;
  buttonTitle: string;
  showAddButton: boolean;
  onAddHeadbarButton?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  buttonTitle,
  showAddButton = false,  // Use the correct property name
  onAddHeadbarButton,
}) => {
  return (
    <header className="bg-white w-full px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">{title}</h1>

        <div className="flex items-center gap-2 md:gap-4">
          {showAddButton && (
            <>
              <ButtonProps
                variant="primary"
                size="regular"
                onClick={onAddHeadbarButton}
                className="gap-2 bg-primary hover:bg-primary/90 hidden md:flex"
              >
                <RiAddLine className="w-5 h-5" />
                <span className="font-semibold text-h6">{buttonTitle}</span>
              </ButtonProps>
              <ButtonProps
                variant="primary"
                size="small"
                onClick={onAddHeadbarButton}
                className="p-2 bg-primary hover:bg-primary/90 flex md:hidden"
              >
                <RiAddLine className="w-5 h-5" />
              </ButtonProps>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
