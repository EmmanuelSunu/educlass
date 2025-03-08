
import React from "react";
import styled from "styled-components";

// HeaderBar component
export const HeaderBarComp = styled.header`
  background-color: #f0f0f0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

export const HeaderButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface HeaderBarProps {
  title: string;
  buttonTitle?: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  buttonTitle = "Add",
  showAddHeadbarButton = false,
  onAddHeadbarButton,
}) => {
  return (
    <HeaderBarComp className="bg-white border-b border-slate-200 py-4 px-6">
      <HeaderTitle className="text-xl font-semibold text-slate-800">
        {title}
      </HeaderTitle>
      {showAddHeadbarButton && (
        <HeaderButton
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          onClick={onAddHeadbarButton}
        >
          {buttonTitle}
        </HeaderButton>
      )}
    </HeaderBarComp>
  );
};

export default HeaderBar;
