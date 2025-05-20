import React from 'react';
import {
  FaArrowCircleRight,
  FaClipboardCheck,
  FaClock,
  FaHome,
  FaProductHunt,
  FaUser
} from 'react-icons/fa';
import { FaArrowRightToCity, FaGear } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';



interface SidebarProps {
  setSelectedComponent: (component: string) => void;
  selectedComponent: string;
}

const Sidebar:React.FC<SidebarProps> = ({ setSelectedComponent, selectedComponent }) => {
  const navigate = useNavigate();

  
  

  return (
    
  );
};

export default Sidebar;
