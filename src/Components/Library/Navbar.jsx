import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import {
  User,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import itparklogo from "../../assets/itparklogo.png";
import ProfileDropdown from "../Dashboard/ProfileDropdown";

const lightGray2 = "#e5e5e5";

const Navbar = ({ onProfileClick, onNotificationClick, onSettingsClick }) => {
  const { isOpen, onToggle } = useDisclosure();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isInternalUser = user && user.role_id === 3;
  const shouldShowProfile = isInternalUser && location.pathname === "/internal-library";

  return (
    <Box bg={lightGray2} color="black" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image
            src={itparklogo}
            alt="ICT Park Logo"
            boxSize="40px"
            borderRadius="full"
          />
          <Text ml={3} fontWeight="bold" color="black">
            Digital Library for ICT Park
          </Text>
        </Flex>

        <IconButton
          size="md"
          icon={isOpen ? <X /> : <MenuIcon />}
          aria-label="Toggle Navigation"
          display={{ md: "none" }}
          onClick={onToggle}
          color="black"
          bg="transparent"
          _hover={{ bg: "#d0d0d0" }}
        />

        <Flex display={{ base: "none", md: "flex" }} ml={10} alignItems="center">
          {shouldShowProfile ? (
            <ProfileDropdown
              onOpenProfile={onProfileClick}
              onOpenNotification={onNotificationClick}
              onOpenSettings={onSettingsClick}
            />
          ) : (
            <Link to="/login">
              <Flex alignItems="center" color="black" cursor="pointer">
                <User style={{ marginRight: "8px" }} />
                <Text>Login</Text>
              </Flex>
            </Link>
          )}
        </Flex>
      </Flex>

      {/* Mobile View */}
      <Collapse in={isOpen} animateOpacity>
        <Flex direction="column" display={{ md: "none" }} mt={4}>
          {shouldShowProfile ? (
            <ProfileDropdown
              onOpenProfile={onProfileClick}
              onOpenNotification={onNotificationClick}
              onOpenSettings={onSettingsClick}
            />
          ) : (
            <Link to="/login">
              <Flex alignItems="center" color="black" cursor="pointer" mt={2}>
                <User style={{ marginRight: "8px" }} />
                <Text>Login</Text>
              </Flex>
            </Link>
          )}
        </Flex>
      </Collapse>
    </Box>
  );
};

export default Navbar;
