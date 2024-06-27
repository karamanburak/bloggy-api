module.exports = (req, res, next) => {
  //! Filtering
  // URL?filter[key1]=value1&filter[key2]=value2 => url array parameter
  // console.log(req.query)
  const filter = req.query?.filter || {};
  console.log("filter: ", filter);

  //* Searching => gelen ifaade içerisinde geçiyor mu geçmiyor mu
  //https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  // URL?search[key1]=value1&search[key2]=value2 => url array parameter

  const search = req.query?.search || {};
  console.log("search: ", search);
  //* { title: 'Testuser1', content: 'Testuser' } => { title: {$regex:'Testuser1'}, content:{ $regex: 'Testuser'} }
  for (let key in search) {
    // search["title"] = {$regex : search["title"]}
    search[key] = { $regex: search[key] };
  }
  console.log("search2: ", search);

  //? Sorting
  // https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
  // URL?sort[key1]=value1&sort[key2]=value2 => url array parameter
  // 1:A-Z - -1:desc: Z-A => deprecated
  // asc: A-Z - desc: Z-A
  const sort = req.query?.sort || {};

  //* Pagination
  // url?page=3&limit=10

  // =>mongoose =>  limit() ve skip()

  //! limit
  let limit = Number(req.query.limit); // => limit methodu number bekler
  limit = limit > 0 ? limit : 20; //eger limit 0 dan büyük değilse 20 olarak ataması yap

  console.log("Limit:", limit); // => Limit: 10 urlden gelen bilgiler her zaman string fomatinda olur degismez!!!

  //? Page
  let page = Number(req.query?.page);
  // page = page > 0 ? page : 1;
  page = page > 0 ? page - 1 : 0;
  // console.log("Page:", page);
  console.log("Typeof Page", typeof page, page);

  //! Skip => atlanacak veri sayisi
  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit; //eger skip 0 dan büyük değilse 0 olarak ataması yap
  console.log(typeof skip, skip);

  // const data = await BlogPost.find({}) = BlogPost.find()
  // const data = await BlogPost.find(filter);
  // const data = await BlogPost.find({filter,search}); => {filter:{ userId: '667d10dc03839026052691ab', published: '0' },search:{ title: { '$regex': 'Testuser1' }, content: { '$regex': 'Testuser' } }} // wrong
  // const [a,b,...x] = [12,13,56,6455,456] => rest
  // function(a,...x) => rest
  // const data = await BlogPost.find({ ...filter, ...search }); // spread => yayma

  //! Static bir yapi icin örnegin BlogPost
  // const data = await BlogPost.find({ ...filter, ...search })
  //   .sort(sort)
  //   .limit(limit)
  //   .skip(skip);

  //! Dinamic bir yapi icin...
  res.getModelList = async function (Model, populate = null) {
    return await Model.find({ ...filter, ...search })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate(populate);
  };
  next();
};