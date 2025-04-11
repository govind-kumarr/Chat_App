import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Input,
  Modal,
  Sheet,
  Stack,
} from "@mui/joy";
import Close from "@mui/icons-material/Close";
import UserCard from "./user-card";
import { useQuery } from "@tanstack/react-query";
import { createGroup, getChatUsers } from "../../api/actions";
import useAppMutation from "../../hooks/useAppMutation";
import { useForm } from "react-hook-form";
import MessageInput from "./message-input";
import FileInput from "./file-input";

const top100Films = [
  {
    label: <UserCard />,
    name: "Govind",
  },
];

const defaultGroupValues = {
  avatar: "",
  participants: [],
  name: "",
};

const CreateGroupModal = () => {
  const { data } = useQuery({
    queryFn: getChatUsers,
    queryKey: "getChatUsers",
    select: (response) => response?.data,
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
  } = useForm({
    defaultValues: defaultGroupValues,
    // resolver: yupResolver(forgotPassSchema), //Make schema for validation
    mode: "onChange",
  });

  const { mutateAsync: createGroupAsync, isPending: creatingGroup } =
    useAppMutation({
      mutaionFn: createGroup,
      mutationKey: "createGroup",
    });

  const userOptions = data?.map((user) => ({
    label: (
      <UserCard
        key={user.id}
        name={user?.name}
        avatar={user?.avatar}
        isActive={user.isActive}
      />
    ),
    name: user.name,
  })); // Use these options in auto complete

  return (
    <Modal
      open={true}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          width: "100%",
          minWidth: "500px",
        }}
      >
        {/* <ModalClose variant="plain" sx={{ m: 2 }} /> */}
        <Stack gap={1}>
          <Stack direction={"row"}>
            {/* Add option to upload avatar here */}
            <Input placeholder="Group Name" fullWidth />
          </Stack>
          <Stack>
            <Autocomplete
              multiple
              options={top100Films}
              defaultValue={[top100Films[0]]}
              renderTags={(tags, getTagProps) =>
                tags.map((item, index) => (
                  <Chip
                    variant="solid"
                    color="primary"
                    endDecorator={<Close fontSize="sm" />}
                    sx={{ minWidth: 0 }}
                    {...getTagProps({ index })}
                  >
                    {item.name}
                  </Chip>
                ))
              }
            />
          </Stack>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <Button type="button" fullWidth>
              Create
            </Button>
          </Stack>
          {/* <Stack sx={{ gap: 4, mt: 2 }}>
            <FileInput />
          </Stack> */}
        </Stack>
      </Sheet>
    </Modal>
  );
};

export default CreateGroupModal;
