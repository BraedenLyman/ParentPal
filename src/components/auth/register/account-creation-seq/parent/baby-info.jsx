import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Input, Progress, Select, SelectItem, Avatar } from "@heroui/react";

export const genders = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Other", label: "Other" },
];

export default function BabyInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, fName: initialFName, lName: initialLName } = location.state || {};
  
  const [fName, setFName] = useState(initialFName || "");
  const [lName, setLName] = useState(initialLName || "");
  const [dob, setDob] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [otherGender, setOtherGender] = useState("");

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
  };

  const isButtonDisabled =
    !fName.trim() ||
    !lName.trim() ||
    !isValidDate(dob) ||
    !selectedGender ||
    (selectedGender === "Other" && otherGender.trim() === "");

  const handleNext = () => {
    navigate("/account-complete", {
      state: {
        category,
        fName,
        lName,
        gender: selectedGender === "Other" ? otherGender : selectedGender,
        dob,
      },
    });
  };

  return (
    <div className="mainDiv">
      <div className="arrowIcon" onClick={() => navigate("/add-baby")}>
        <ArrowLeftIcon />
      </div>

      <Progress aria-label="Loading..." className="progressBar" value={80} />
      <h1 className="heading">Tell us more about your {category || "baby"}</h1>

      <div className="inputContainer">
        <Avatar
          name={`${fName?.charAt(0) ?? ""}${lName?.charAt(0) ?? ""}`}
          showFallback
          className="avatarSize"
        />
        <p>{fName} {lName}</p>

        <Input
          label={(category + "'s" || "Baby's") + " first name"}
          placeholder={`Enter your ${category || "baby"}'s first name`}
          type="text"
          variant="bordered"
          isRequired
          value={fName}
          onChange={(e) => setFName(e.target.value)}
        />

        <Input
          label={(category + "'s" || "Baby's") + " last name"}
          placeholder={`Enter your ${category || "baby"}'s last name`}
          type="text"
          variant="bordered"
          isRequired
          value={lName}
          onChange={(e) => setLName(e.target.value)}
        />

        <Input
          label={(category + "'s" || "Baby's") + " date of birth"}
          type="date"
          variant="bordered"
          isRequired
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <Select
          selectedKeys={[selectedGender]}
          onSelectionChange={(keys) => {
            setSelectedGender(Array.from(keys)[0]);
            setOtherGender(""); // Reset if user switches gender
          }}
          items={genders}
          label="Gender"
          placeholder="Select your gender"
          variant="bordered"
          isRequired
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        {selectedGender === "Other" && (
          <Input
            label="Other Gender"
            placeholder="Enter your gender"
            type="text"
            variant="bordered"
            isRequired
            value={otherGender}
            onChange={(e) => setOtherGender(e.target.value)}
          />
        )}
      </div>

      <div className="buttonContainer">
        <Button
          color="primary"
          className="button"
          onPress={handleNext}
          isDisabled={isButtonDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
