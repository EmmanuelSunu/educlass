import React, { ReactNode } from "react";
import styled from "styled-components"; // Assuming styled-components for styling

// New HeaderBar component
const HeaderBar = styled.header`
  background-color: #f0f0f0; /* Example light background */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const HeaderButton = styled.button`
  background-color: #4CAF50; /* Example green button */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;


// Updated DashboardLayout to use HeaderBar
interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  buttonTitle?: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  buttonTitle = "",
  showAddHeadbarButton = false,
  onAddHeadbarButton,
}) => {
  return (
    <div>
      <HeaderBar>
        <HeaderTitle>{title}</HeaderTitle>
        {showAddHeadbarButton && (
          <HeaderButton onClick={onAddHeadbarButton}>{buttonTitle}</HeaderButton>
        )}
      </HeaderBar>
      <div>{children}</div>
    </div>
  );
};

// Example usage in Lecturer and Student layouts (replace ... with actual content)
const LecturerLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout title="Lecturer Dashboard" showAddHeadbarButton buttonTitle="Add">
    {children}
  </DashboardLayout>
);

const StudentLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout title="Student Dashboard">
    {children}
  </DashboardLayout>
);


export { DashboardLayout, LecturerLayout, StudentLayout, HeaderBar};