import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Stack,
} from "@mui/joy";
import Close from "@mui/icons-material/Close";
import UserCard from "./user-card";
import { useQuery } from "@tanstack/react-query";
import { createGroup, getChatUsers } from "../../api/actions";
import useAppMutation from "../../hooks/useAppMutation";
import { Controller, useForm } from "react-hook-form";
import { array, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultGroupValues = {
  participants: [],
  name: "",
};

const groupCreateSchema = object({
  participants: array().min(1, "There must be atleast one member"),
  name: string().required("Please enter group name"),
});

const CreateGroupModal = ({ open = false, handleClose = () => null }) => {
  const { data: users = [] } = useQuery({
    queryFn: getChatUsers,
    queryKey: "getChatUsers",
    select: (response) => response?.data?.users || [],
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
    resolver: yupResolver(groupCreateSchema),
    mode: "onChange",
  });

  const { mutateAsync: createGroupAsync, isPending: creatingGroup } =
    useAppMutation({
      mutationFn: createGroup,
      mutationKey: "createGroup",
    });

  const handleGroupSubmit = (values) => {
    const payload = {
      name: values?.name,
      participants: values?.participants?.map((p) => p?.id),
    };
    createGroupAsync(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClose={handleClose}
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
          // mt: 4,
        }}
      >
        <Stack
          gap={1}
          component={"form"}
          onSubmit={handleSubmit(handleGroupSubmit)}
        >
          <Box m={1}>
            <ModalClose variant="plain" disabled={creatingGroup} />
          </Box>

          <Stack direction={"row"}>
            {/* Add option to upload avatar here */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormControl
                  error={!!errors?.[`${field.name}`]?.message}
                  sx={{ width: "100%" }}
                >
                  <Input placeholder="Group Name" fullWidth {...field} />
                  <FormHelperText>{errors?.name?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Stack>
          <Stack>
            <FormControl error={errors?.participants?.message}>
              <Autocomplete
                multiple
                options={users}
                value={watch("participants") || []}
                placeholder="Add Users"
                renderTags={(tags, getTagProps) =>
                  tags.map((item, index) => (
                    <Chip
                      variant="solid"
                      color="primary"
                      endDecorator={<Close fontSize="sm" />}
                      sx={{ minWidth: 0 }}
                      {...getTagProps({ index })}
                    >
                      {item?.username}
                    </Chip>
                  ))
                }
                onChange={(e, v) => {
                  setValue("participants", v, {
                    shouldValidate: true,
                  });
                }}
                getOptionLabel={(option) => (
                  <UserCard
                    key={option.id}
                    name={option?.username}
                    avatar={option?.avatar}
                    isActive={option.isActive}
                  />
                )}
              />
              <FormHelperText>{errors?.participants?.message}</FormHelperText>
            </FormControl>
          </Stack>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <Button type="submit" disabled={creatingGroup} fullWidth>
              {creatingGroup ? <CircularProgress /> : "Create"}
            </Button>
          </Stack>
        </Stack>
      </Sheet>
    </Modal>
  );
};

export default CreateGroupModal;
