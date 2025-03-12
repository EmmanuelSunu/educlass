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
    <header className="bg-white w-full px-6 py-4 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>

        <div className="flex items-center gap-4">
          {showAddButton && (  // Use the correct property here as well
            <ButtonProps
              variant="primary"
              size="regular"
              onClick={onAddHeadbarButton}
              className="gap-2 bg-primary hover:bg-primary/90 hidden md:flex"
            >
              <RiAddLine className="w-5 h-5" />
              <span className="font-semibold text-h6">{buttonTitle}</span>
            </ButtonProps>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
