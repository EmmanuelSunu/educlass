
import React from "react";
import styled from "styled-components";

export const HeaderBarComp = styled.header`
  background-color: #f0f0f0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #333;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Button = styled.button`
  background-color: #2A9F06;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #228205;
  }
`;

interface HeaderBarProps {
  title: string;
  buttonTitle?: string;
  showAddButton?: boolean;
  onAddButtonClick?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  buttonTitle = "Add New",
  showAddButton = true,
  onAddButtonClick,
}) => {
  return (
    <HeaderBarComp className="bg-white dark:bg-gray-800 shadow-sm">
      <Title className="text-gray-900 dark:text-white">{title}</Title>
      {showAddButton && (
        <ButtonContainer>
          <Button onClick={onAddButtonClick} className="bg-primary-500 hover:bg-primary-600">
            {buttonTitle}
          </Button>
        </ButtonContainer>
      )}
    </HeaderBarComp>
  );
};

export default HeaderBar;
