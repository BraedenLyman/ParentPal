import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Button, Image, Input, Link, Select, SelectItem, Avatar } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseAuth";
import API_URL from "../../../config/api";
import "./register-styles.css";

export const genders = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Other", label: "Other" },
];

export default function CreateAccount() {
  const navigate = useNavigate();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [accountType, setAccountType] = useState("");
  const [userDOB, setUserDOB] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [otherGender, setOtherGender] = useState("");

  const [babyCategory, setBabyCategory] = useState("");
  const [bFName, setBFName] = useState("");
  const [bLName, setBLName] = useState("");
  const [bDob, setBDob] = useState("");
  const [bGender, setBGender] = useState("");
  const [bOtherGender, setBOtherGender] = useState("");

  const accountTypes = [
    { key: "parent", label: "Parent" },
    { key: "babysitter", label: "Babysitter" },
  ];

  const babyCategories = [
    { key: "Baby", label: "0–12 months" },
    { key: "Toddler", label: "1–3 years" },
    { key: "Pre-Schooler", label: "3–5 years" },
    { key: "Grade-Schooler", label: "5–12 years" },
  ];

  useEffect(() => {
    const newErrors = [];
    if (password.length < 8) newErrors.push("Password must be at least 8 characters long.");
    if ((password.match(/[A-Z]/g) || []).length < 1) newErrors.push("Password must include at least 1 upper case letter.");
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) newErrors.push("Password must include at least 1 symbol.");
    setErrors(newErrors);
  }, [password]);

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
  };

  const handleCreateAccount = async () => {
    if (errors.length > 0) return;
    if (!accountType) return;
    if (!isValidDate(userDOB) || !selectedGender || (selectedGender === "Other" && !otherGender.trim())) return;
    if (accountType === "parent") {
      if (!babyCategory || !bFName.trim() || !bLName.trim() || !isValidDate(bDob) || !bGender || (bGender === "Other" && !bOtherGender.trim())) return;
    }

    setIsCreating(true);

    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUid = userCredential.user.uid;

    const payload = {
      fName,
      lName,
      email,
      accountType,
      dob: userDOB,
      gender: selectedGender === "Other" ? otherGender : selectedGender,
    };

    if (accountType === "parent") {
      payload.baby = {
        bFName,
        bLName,
        bDob,
        bGender: bGender === "Other" ? bOtherGender : bGender,
        babyCategory,
      };
    }

    await axios.post(`${API_URL}/api/accounts`, {
      firebaseUid,
      ...payload,
    });

    navigate("/account-complete", { state: payload });
  } catch (error) {
    console.error("Error creating account:", error);
    setErrors([error.message]);
  } finally {
    setIsCreating(false);
  }
  };

  const isButtonDisabled = () => {
    if (errors.length > 0 || !accountType) return true;
    if (!isValidDate(userDOB) || !selectedGender || (selectedGender === "Other" && !otherGender.trim())) return true;
    if (accountType === "parent") {
      if (!babyCategory || !bFName.trim() || !bLName.trim() || !isValidDate(bDob) || !bGender || (bGender === "Other" && !bOtherGender.trim())) return true;
    }
    return false;
  };

  return (
    <div className="mainDiv">
      <div className="imgContainer">
        <Image
          alt="Parent Pal Logo"
          src="/images/ParentPal.png"
          width={200}
          classNames={{ wrapper: "logo" }}
        />
      </div>

      <h1 className="heading">Create an account</h1>

      <div className="inputContainer">
        <Input
          label="First Name"
          placeholder="Enter your first name"
          type="text"
          variant="bordered"
          isRequired
          value={fName}
          onChange={(e) => setFName(e.target.value)}
        />

        <Input
          label="Last Name"
          placeholder="Enter your last name"
          type="text"
          variant="bordered"
          isRequired
          value={lName}
          onChange={(e) => setLName(e.target.value)}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          isRequired
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          errorMessage={
            errors.length > 0 ? (
              <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
            ) : null
          }
          isInvalid={passwordTouched && errors.length > 0}
          label="Password"
          placeholder="Enter your password"
          type={isPasswordVisible ? "text" : "password"}
          variant="bordered"
          isRequired
          value={password}
          onValueChange={setPassword}
          onFocus={() => setPasswordTouched(true)}
          endContent={
            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? <EyeSlashIcon className="hiddenPasswordIcon" /> : <EyeIcon className="showPasswordIcon" />}
            </button>
          }
        />

        <Select
          selectedKeys={[accountType]}
          onSelectionChange={(keys) => setAccountType(Array.from(keys)[0])}
          items={accountTypes}
          label="Account Type"
          placeholder="Select your account type"
          //variant="bordered"
          isRequired
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        {accountType && (
          <>
            {/* User DOB */}
            <Input
              label="Date of Birth"
              type="date"
              //variant="bordered"
              isRequired
              value={userDOB}
              onChange={(e) => setUserDOB(e.target.value)}
            />

            <Select
              selectedKeys={[selectedGender]}
              onSelectionChange={(keys) => {
                setSelectedGender(Array.from(keys)[0]);
                setOtherGender("");
              }}
              items={genders}
              label="Gender"
              placeholder="Select your gender"
              //variant="bordered"
              isRequired
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            {selectedGender === "Other" && (
              <Input
                label="Other Gender"
                placeholder="Enter your gender"
                type="text"
                //variant="bordered"
                isRequired
                value={otherGender}
                onChange={(e) => setOtherGender(e.target.value)}
              />
            )}
          </>
        )}

        {accountType === "parent" && (
          <>
            <Select
              selectedKeys={[babyCategory]}
              onSelectionChange={(keys) => setBabyCategory(Array.from(keys)[0])}
              items={babyCategories}
              label="Baby Type"
              placeholder="Select your baby's age group"
              //variant="bordered"
              isRequired
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Input
              label="Baby First Name"
              placeholder="Enter baby's first name"
              type="text"
              //variant="bordered"
              isRequired
              value={bFName}
              onChange={(e) => setBFName(e.target.value)}
            />

            <Input
              label="Baby Last Name"
              placeholder="Enter baby's last name"
              type="text"
              //variant="bordered"
              isRequired
              value={bLName}
              onChange={(e) => setBLName(e.target.value)}
            />

            <Input
              label="Baby Date of Birth"
              type="date"
              //variant="bordered"
              isRequired
              value={bDob}
              onChange={(e) => setBDob(e.target.value)}
            />

            <Select
              selectedKeys={[bGender]}
              onSelectionChange={(keys) => {
                setBGender(Array.from(keys)[0]);
                setBOtherGender("");
              }}
              items={genders}
              label="Baby Gender"
              placeholder="Select your baby's gender"
              //variant="bordered"
              isRequired
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            {bGender === "Other" && (
              <Input
                label="Other Baby Gender"
                placeholder="Enter baby's gender"
                type="text"
                //variant="bordered"
                isRequired
                value={bOtherGender}
                onChange={(e) => setBOtherGender(e.target.value)}
              />
            )}
          </>
        )}

        <Button
          color="primary"
          className="button"
          isDisabled={isCreating || isButtonDisabled()}
          isLoading={isCreating}
          onClick={handleCreateAccount}
        >
          Create an account
        </Button>

        <p className="newUser">
          Already have an account? <Link as={RouterLink} to="/sign-in">Log in</Link>
        </p>
      </div>
    </div>
  );
}
