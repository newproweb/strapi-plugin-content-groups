import { getFetchClient } from "@strapi/helper-plugin";

export const getContentTypes = async (kind) => {
  const { get } = getFetchClient();
  const { data } = await get(`/content-manager/content-types?kind=${kind}`);

  return data.data.filter((d) => d.isDisplayed);
};
