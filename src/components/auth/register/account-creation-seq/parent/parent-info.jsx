import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Link as RouterLink } from "react-router-dom";
import { Button, Progress, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

export default function ParentInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const [otherValue, setOtherValue] = React.useState("");

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );
    
    return (
        <div className="mainDiv">
            
            <div className="arrowIcon" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
            </div>

            <Progress aria-label="Loading..." className="progressBar" value={50} />
            <h1 className="heading">Tell us more about yourself</h1>

            <div className="inputContainer">
        {/* Birthday Input */}
        <Input label="Date of Birth" type="date" variant="bordered" />

        {/* Gender Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              variant="bordered"
              classNames={{
                base: "w-full max-w-[400px]", // Match button width with inputs
              }}
            >
              {selectedValue || "Select Gender"}
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            disallowEmptySelection
            aria-label="Select Gender"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={setSelectedKeys}
            classNames={{
              base: "w-full max-w-[400px] text-sm", // Match dropdown width and font size
              item: "hover:bg-gray-100", // Light hover styling
            }}
          >
            <DropdownItem key="male">Male</DropdownItem>
            <DropdownItem key="female">Female</DropdownItem>
            <DropdownItem key="Other">Other</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Show extra input if "Other" is selected */}
        {selectedValue.toLowerCase() === "other" && (
          <Input
            label="Please specify"
            variant="bordered"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            className="w-full max-w-[400px]"
          />
        )}
      </div>
            <div className="buttonContainer">
                <Button
                    color="primary"
                    className="button"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
