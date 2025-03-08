
import React from "react";
import HeaderBar from "../../components/HeaderBar";

interface HeaderBarProps {
  title: string;
  buttonTitle: string;
  showAddHeadbarButton?: boolean;
  onAddHeadbarButton?: () => void;
}

const StudentHeaderBar: React.FC<HeaderBarProps> = (props) => {
  return <HeaderBar {...props} />;
};

export default StudentHeaderBar;
