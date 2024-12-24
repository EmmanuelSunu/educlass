import React from "react";
import ButtonProps from "../../components/ButtonProps";
import { RiAddLine } from "react-icons/ri";

interface HeaderBarProps {
  title: string;
  buttonTitle: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  buttonTitle,
  showAddHeadbarButton = false,
  onAddHeadbarButton,
}) => {
  return (
    <header className="bg-white w-full px-6 py-4 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>

        <div className="flex items-center gap-4">
          {showAddHeadbarButton && (
            <ButtonProps
              variant="primary"
              size="regular"
              onClick={onAddHeadbarButton}
              className="gap-2"
            >
              <RiAddLine className="w-5 h-5" />
              {buttonTitle}
            </ButtonProps>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
