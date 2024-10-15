import { useState } from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MenuItem, FormControl, Select } from "@mui/material";
import ToggleSwitch from "./ToggleSwitch.tsx";
import { Harbor } from "../types/Harbor";
import { BlockData } from "../types/TidalWater";

// Styled container for the button
const ButtonContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

// Styled bar at the top of the button
const TopBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) =>
    props.color || "#90caf9"}; /* Muted blue, change as needed */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

// Dropdown inside the button
const DropdownContainer = styled.div`
  padding: 50px 10px 10px 10px;
`;

// Close button at the top-right corner
const CloseButton = styled(IconButton)`
  position: absolute;
  top: 4px;
  right: 4px;
  float: right;
`;

const LocationContainer = ({
  blocks,
  block,
  color,
  onClose,
  onChange,
  onToggle,
  values,
}: {
  blocks: BlockData[];
  block: BlockData;
  color: string;
  onClose: () => void;
  onChange: (event: any) => void;
  onToggle: (event: boolean, block: BlockData) => void;
  values: Harbor[];
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
    onChange(event);
  };

  return (
    <ButtonContainer>
      <TopBar color={color} />
      <CloseButton
        key="close-btn"
        size="small"
        aria-label="delete"
        onClick={(e) => onClose()}
      >
        <CloseIcon style={{ color: "gray" }} />
      </CloseButton>
      <ToggleSwitch onToggle={(e: boolean) => onToggle(e, block)} />
      <DropdownContainer>
        <FormControl fullWidth>
          <Select
            value={selectedValue ?? block.value?.id ?? ""}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              color: "#fff", // White text for dropdown
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: `${color}`, // Muted blue border
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff", // White border on hover
              },
              ".MuiSvgIcon-root": {
                color: `${color}`, // Color of the dropdown arrow
              },
            }}
            variant="outlined"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {values
              .filter(
                (s: Harbor) =>
                  block.value?.id === s.id ||
                  !blocks.some((s1) => s1.value?.id === s.id),
              )
              .map((value: any) => (
                <MenuItem key={value.id} value={value.id}>
                  {value.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DropdownContainer>
    </ButtonContainer>
  );
};

export default LocationContainer;
