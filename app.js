const get = async () => {
  const res = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  console.log(res.data);
};
