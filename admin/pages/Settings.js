import React, { useEffect, useState } from "react";
import {
  Main,
  ContentLayout,
  HeaderLayout,
  Box,
  Flex,
  Typography,
  Button,
  Divider,
  TextInput,
} from "@strapi/design-system";
import { ArrowRight, Drag, Pencil, Plus, Trash } from "@strapi/icons";
import { getContentTypes } from "../utils/collection-types";
import { getConfigs, setConfigs } from "../utils/api";

const SettingsPage = () => {
  const [collectionTypes, setCollectionTypes] = useState([]);
  const [singleTypes, setSingleTypes] = useState([]);
  const [customGroups, setCustomGroups] = useState({});
  const [editingGroup, setEditingGroup] = useState("");
  const [draggingGroup, setDraggingGroup] = useState("");

  const newGroupName = "New Group";

  useEffect(() => {
    Promise.all([
      getContentTypes("collectionType"),
      getContentTypes("singleType"),
      getConfigs(),
    ]).then(([collectionTypes, singleTypes, groups]) => {
      setCollectionTypes(collectionTypes);
      setSingleTypes(singleTypes);
      setCustomGroups(groups);
    });
  }, []);

  const saveGroups = () => setConfigs(customGroups);

  const addNewGroup = () => {
    setCustomGroups({
      ...customGroups,
      [newGroupName]: customGroups[newGroupName] ?? [],
    });
  };

  const removeFromGroup = (groupName, uid) => {
    const oldGroups = { ...customGroups };
    oldGroups[groupName] = oldGroups[groupName].filter((g) => g !== uid);

    setCustomGroups(oldGroups);
  };

  const changeEditingGroup = (e, oldGroupName) => {
    setEditingGroup(e.target.value);
    const oldGroups = { ...customGroups };

    Object.defineProperty(
      oldGroups,
      e.target.value,
      Object.getOwnPropertyDescriptor(oldGroups, oldGroupName)
    );
    delete oldGroups[oldGroupName];
    setCustomGroups(oldGroups);
  };

  const onDragStart = (ev) => ev.dataTransfer.setData("uid", ev.target.id);

  const onDrop = (ev, groupName) => {
    const uid = ev.dataTransfer.getData("uid");

    const newGroups = {
      ...customGroups,
      [groupName]: [...customGroups[groupName], uid],
    };

    setCustomGroups(newGroups);
    setDraggingGroup("");
    ev.preventDefault();
  };

  return (
    <Main labelledBy="title" aria-busy="true">
      <HeaderLayout
        id="title"
        title="Content Groups"
        subtitle="Manage groups"
      />
      <ContentLayout>
        <Box background="neutral0" padding={8}>
          <Flex gap={2}>
            <Flex
              width="100%"
              padding={2}
              background="neutral150"
              gap={2}
              direction="column"
              style={{ alignSelf: "stretch" }}
            >
              {Object.entries(customGroups).map(([groupName, uids]) => (
                <Box width="100%">
                  {editingGroup === groupName ? (
                    <TextInput
                      label={groupName}
                      aria-label="Group Name"
                      autofocus={true}
                      onBlur={() => setEditingGroup("")}
                      onChange={(e) => changeEditingGroup(e, groupName)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && setEditingGroup("")
                      }
                      borderStyle="dashed"
                      size="s"
                      value={groupName}
                      width="100%"
                    />
                  ) : (
                    <Button
                      width="100%"
                      onClick={() => setEditingGroup(groupName)}
                      variant="success-light"
                      startIcon={<Pencil />}
                    >
                      {groupName}
                    </Button>
                  )}

                  <Flex direction="column" marginLeft={5} marginTop={1} gap={1}>
                    {uids.map((uid) => (
                      <Flex gap={1} width="100%">
                        <Button
                          startIcon={<ArrowRight />}
                          variant="tertiary"
                          onClick={() => removeFromGroup(groupName, uid)}
                        ></Button>
                        <Button
                          width="100%"
                          variant="tertiary"
                          startIcon={<Drag />}
                        >
                          {uid}
                        </Button>
                      </Flex>
                    ))}
                  </Flex>

                  <Box
                    marginTop={2}
                    background="neutral200"
                    borderStyle="dashed"
                    borderColor={
                      draggingGroup === groupName ? "primary500" : "neutral500"
                    }
                    height="30px"
                    textAlign="center"
                    onDrop={(ev) => onDrop(ev, groupName)}
                    onDragEnter={() => setDraggingGroup(groupName)}
                    onDragLeave={() => setDraggingGroup("")}
                    onDragOver={(ev) => ev.preventDefault()}
                    style={{
                      alignContent: "center",
                      borderRadius: "10px",
                      borderWidth: "2px",
                    }}
                  >
                    <Typography variant="pl">
                      Drag & Drop content-types
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Button
                width="100%"
                style={{ borderStyle: "dashed" }}
                variant="secondary"
                startIcon={<Plus />}
                onClick={addNewGroup}
              >
                Create new group
              </Button>
            </Flex>
            <Box
              style={{ alignSelf: "stretch" }}
              width="100%"
              padding={2}
              background="neutral150"
            >
              <Typography variant="beta">Collection Types</Typography>
              <Divider color="primary500" style={{ margin: ".5rem 0" }} />
              <Flex direction="column" gap={1}>
                {collectionTypes
                  .filter(
                    (t) => !Object.values(customGroups).flat().includes(t.uid)
                  )
                  .map((t) => (
                    <Box width="100%">
                      <Button
                        startIcon={<Drag />}
                        width="100%"
                        variant="tertiary"
                        id={t.uid}
                        draggable={true}
                        onDragStart={onDragStart}
                      >
                        {t.info.displayName}
                      </Button>
                    </Box>
                  ))}
              </Flex>

              <Divider color="primary500" style={{ marginTop: "1rem" }} />
              <Typography variant="beta">Single Types</Typography>
              <Divider color="primary500" style={{ margin: ".5rem 0" }} />
              <Flex direction="column" gap={1}>
                {singleTypes
                  .filter(
                    (t) => !Object.values(customGroups).flat().includes(t.uid)
                  )
                  .map((t) => (
                    <Box width="100%">
                      <Button
                        startIcon={<Drag />}
                        width="100%"
                        variant="tertiary"
                        id={t.uid}
                        onDragStart={onDragStart}
                        draggable={true}
                      >
                        {t.info.displayName}
                      </Button>
                    </Box>
                  ))}
              </Flex>
            </Box>
          </Flex>

          <Box marginTop={2}>
            <Button onClick={() => saveGroups()} variant="success">
              Save
            </Button>
          </Box>
        </Box>
      </ContentLayout>
    </Main>
  );
};

export default SettingsPage;
