import { DataGrid } from "@material-ui/data-grid";
import useHttp from "../helper/http";
import { styled } from "baseui";
import { Client as Styletron } from "styletron-engine-atomic";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import { Button, KIND, SIZE } from "baseui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as ModalSize,
  ROLE,
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import user_action from "../state/actions/user.action";
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { ListItem, ListItemLabel, ARTWORK_SIZES } from "baseui/list";
import { Context } from "../state/store";
import { SnackbarProvider, useSnackbar, DURATION } from "baseui/snackbar";

const engine = new Styletron();
const Centered = styled("div", {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  margin: "10px",
});

const useStyles = makeStyles({
  root: {
    fontFamily: "Poppins",
    marginBottom: "120px"
  },
});

function UserTable() {
  const { enqueue } = useSnackbar();
  const http = useHttp();
  const [state, dispatch] = useContext(Context);
  const { token } = state.user_reducer;
  const [progress, setIsProgress] = useState(false);
  const [user, userFetch] = useState([]);
  const [detail, setDetail] = useState({});
  const [popupopen, popup] = useState(false);
  const [createpopuptrigger, createpopup] = useState(false);
  const [popup_progress, progress_pop] = useState(false);
  const [form, setForm] = useState({});
  const classes = useStyles();

  const getById = (value) => {
    progress_pop(true);
    http
      .get("user/" + value.id)
      .then(({ data }) => {
        popup(true);
        progress_pop(false);
        setDetail(data.result);
      })
      .catch((err) => console.log(err));
  };
  const editById = (value) => {
    progress_pop(true);
    http
      .get("user/" + value.id)
      .then(({ data }) => {
        setForm({
          accountNumber: data.result.accountNumber,
          emailAddress: data.result.emailAddress,
          identityNumber: data.result.identityNumber,
          userName: data.result.userName,
          _id: data.result._id,
        });
        createpopup(true);
        progress_pop(false);
        setDetail(data.result);
      })
      .catch((err) => console.log(err));
  };

  const createView = () => {
    createpopup(true);
  };

  const getByAccountNumber = (value) => {
    popup(true);
    progress_pop(true);
    http
      .get("user/account-number/" + value.row.accountNumber)
      .then(({ data }) => {
        console.log(data);
        progress_pop(false);
        setDetail(data.result);
      })
      .catch((err) => console.log(err));
    console.log(value.id);
  };

  const getByIdentityNumber = (value) => {
    http
      .get("user/identity-number/" + value.row.identityNumber)
      .then(({ data }) => {
        if (data.status) {
          popup(true);
          progress_pop(true);
          setDetail(data.result);
        } else {
          enqueue(
            {
              message: data.error.message,
            },
            DURATION.long
          );
        }
        progress_pop(false);
      })
      .catch((err) => console.log(err));
    console.log(value.id);
  };

  const removeById = (value) => {
    setIsProgress(true);
    http
      .delete("user/remove/" + value.id)
      .then(({ data }) => {
        setIsProgress(false);
        get_user();
      })
      .catch((err) => console.log(err));
    console.log(value.id);
  };

  const saveBy = () => {
    let param = form;
    if (!param._id) {
      http
        .post("/register/user", param)
        .then(({ data }) => {
          if (data.status) {
            createpopup(false);
            get_user();
            setForm({});
          } else {
            enqueue(
              {
                message: data.error.message,
              },
              DURATION.long
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      let form = {
        userName: param.userName,
        accountNumber: param.accountNumber,
        identityNumber: param.identityNumber,
        emailAddress: param.emailAddress,
      };
      http
        .put("user/update/" + param._id, form)
        .then(({ data }) => {
          setIsProgress(false);
          get_user();
          createpopup(false);
          setForm({});
        })
        .catch((err) => console.log(err));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 240 },
    { field: "userName", headerName: "Name", width: 220 },
    {
      field: "accountNumber",
      headerName: "Account number",
      width: 220,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Button
              style={{ fontFamily: "Poppins" }}
              onClick={() => getByAccountNumber(params)}
              kind={KIND.secondary}
              startEnhancer={() => <InfoIcon style={{ fontSize: 18 }} />}
              size={SIZE.compact}
            >
              {params.row.accountNumber}
            </Button>
          </React.Fragment>
        );
      },
    },
    {
      field: "identityNumber",
      headerName: "Identity number",
      width: 220,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Button
              style={{ fontFamily: "Poppins" }}
              onClick={() => getByIdentityNumber(params)}
              kind={KIND.secondary}
              startEnhancer={() => <InfoIcon style={{ fontSize: 18 }} />}
              size={SIZE.compact}
            >
              {params.row.identityNumber}
            </Button>
          </React.Fragment>
        );
      },
    },
    { field: "emailAddress", headerName: "Email address", width: 220 },
    {
      field: "",
      headerName: "Action",
      width: 320,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Button
              style={{ fontFamily: "Poppins" }}
              onClick={() => getById(params)}
              kind={KIND.secondary}
              size={SIZE.compact}
            >
              getbyID
            </Button>
            <Button
              style={{ fontFamily: "Poppins" }}
              onClick={() => editById(params)}
              kind={KIND.secondary}
              size={SIZE.compact}
              startEnhancer={() => <EditIcon style={{ fontSize: 15 }} />}
            >
              edit
            </Button>
            <Button
              style={{ fontFamily: "Poppins" }}
              onClick={() => removeById(params)}
              kind={KIND.secondary}
              size={SIZE.compact}
              startEnhancer={() => (
                <DeleteOutlinedIcon style={{ fontSize: 15 }} />
              )}
            >
              remove
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

  useEffect(() => {
    if (!!token) {
      setIsProgress(true);

      get_user();
    }
  }, [token]);

  const changeInput = (name, e) => {
    setForm({
      ...form,
      [name]: e.target.value,
    });
  };

  const get_user = () => {
    http
      .get("user")
      .then(({ data }) => {
        setIsProgress(false);

        userFetch(data.result.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <SnackbarProvider>
      <div style={{ height: "400px", width: "900px", marginBottom: "120px" }}>
        {progress ? (
          <Centered>
            <p style={{ fontFamily: "Poppins" }}>Please wait data embed</p>
          </Centered>
        ) : (
          <React.Fragment>
            <Button
              style={{ fontFamily: "Poppins", marginBottom: 20 }}
              onClick={() => createView()}
              kind={KIND.primary}
              size={SIZE.compact}
            >
              Create user
            </Button>
            <DataGrid
              className={classes.root}
              rows={user}
              columns={columns}
              pageSize={5}
              checkboxSelection
            />
          </React.Fragment>
        )}

        <Modal
          onClose={() => popup(false)}
          closeable
          isOpen={popupopen}
          animate
          autoFocus
          size={ModalSize.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Information user</ModalHeader>
          <ModalBody>
            <ListItem
              artwork={(props) => <InfoIcon {...props} />}
              artworkSize={ARTWORK_SIZES.LARGE}
              endEnhancer={() => (
                <ListItemLabel>{detail.userName}</ListItemLabel>
              )}
              sublist
            >
              <ListItemLabel>user name</ListItemLabel>
            </ListItem>
            <ListItem
              artwork={(props) => <InfoIcon {...props} />}
              artworkSize={ARTWORK_SIZES.LARGE}
              endEnhancer={() => (
                <ListItemLabel>{detail.accountNumber}</ListItemLabel>
              )}
              sublist
            >
              <ListItemLabel>account number</ListItemLabel>
            </ListItem>
            <ListItem
              artwork={(props) => <InfoIcon {...props} />}
              artworkSize={ARTWORK_SIZES.LARGE}
              endEnhancer={() => (
                <ListItemLabel>{detail.identityNumber}</ListItemLabel>
              )}
              sublist
            >
              <ListItemLabel>identity number</ListItemLabel>
            </ListItem>
            <ListItem
              artwork={(props) => <InfoIcon {...props} />}
              artworkSize={ARTWORK_SIZES.LARGE}
              endEnhancer={() => (
                <ListItemLabel>{detail.emailAddress}</ListItemLabel>
              )}
              sublist
            >
              <ListItemLabel>email address</ListItemLabel>
            </ListItem>
          </ModalBody>
        </Modal>
        <Modal
          onClose={() => createpopup(false)}
          closeable
          isOpen={createpopuptrigger}
          animate
          autoFocus
          size={ModalSize.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Form user</ModalHeader>
          <ModalBody>
            <FormControl label={() => "username"} caption={() => "user name"}>
              <Input
                onChange={(e) => changeInput("userName", e)}
                value={form.userName}
              />
            </FormControl>
            <FormControl
              label={() => "account number"}
              caption={() => "account number is required"}
            >
              <Input
                onChange={(e) => changeInput("accountNumber", e)}
                value={form.accountNumber}
              />
            </FormControl>
            <FormControl
              label={() => "identity number"}
              caption={() => "identity number is required"}
            >
              <Input
                onChange={(e) => changeInput("identityNumber", e)}
                value={form.identityNumber}
              />
            </FormControl>
            <FormControl
              label={() => "email address"}
              caption={() => "email address is required"}
            >
              <Input
                onChange={(e) => changeInput("emailAddress", e)}
                value={form.emailAddress}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ModalButton
              onClick={() => createpopup(false)}
              style={{ fontFamily: "Poppins" }}
              kind={ButtonKind.tertiary}
            >
              cancel
            </ModalButton>
            <ModalButton
              isLoading={progress}
              onClick={() => saveBy()}
              style={{ fontFamily: "Poppins" }}
            >
              submit
            </ModalButton>
          </ModalFooter>
        </Modal>
      </div>
    </SnackbarProvider>
  );
}


export default function table() {
  return (
    <SnackbarProvider>
      <UserTable/>
    </SnackbarProvider>
  );
}