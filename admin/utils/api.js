import { getFetchClient } from "@strapi/helper-plugin";

export const getConfigs = async () => {
  const { get } = getFetchClient();
  const { data } = await get("/content-groups/configs");

  return data;
};

export const setConfigs = async (configs) => {
  const { post } = getFetchClient();
  const { data } = await post("/content-groups/configs", configs);

  return data.data;
};
