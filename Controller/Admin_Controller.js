const User = require("../Models/User_Model");
const CustomError = require("../errors");
const Blog = require("../Models/Blog_Models");
const { createJWT } = require("../utils");
const { attachCookiesToResp } = require("../utils/AttachCookies");
const uuid = require("uuid");
const { sendMailJetEmail } = require("../utils/SendEmail");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminUserDoc = await User.findOne({ email });
  if (!adminUserDoc) {
    throw new CustomError.BadRequestError("Wrong credentials");
  }
  if (adminUserDoc.authorization !== process.env.ADMIN_AUTHRIZATION_CODE) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to access this route"
    );
  }
  const checkPass = await adminUserDoc.checkCryptedPassword(password);
  if (!checkPass) {
    throw new CustomError.BadRequestError("Passowrd wrong");
  }
  const token = createJWT({
    userId: adminUserDoc._id,
    userName: adminUserDoc.name,
    authorization: adminUserDoc.authorization,
  });
  console.log(token);
  // Attaching cookies to reponse
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: false,
    expires: new Date(Date.now() + oneDay),
    sameSite: "none",
    secure: true,
  });
  res.cookie("userId", `${adminUserDoc._id}`, {
    httpOnly: false,
    expires: new Date(Date.now() + oneDay),
    sameSite: "none",
    secure: true,
  });
  res.cookie("userName", `${adminUserDoc.name}`, {
    httpOnly: false,
    expires: new Date(Date.now() + oneDay),
    sameSite: "none",
    secure: true,
  });
  res.header;
  res.status(201).json({
    success: true,
    profileImg: adminUserDoc.profileImg,
    userName: adminUserDoc.name,
  });
  res.status(201).json({ success: true });
};

exports.adminForgotPassword = async (req, res) => {
  const { email } = req.body;
  const foundAdmin = await User.findOne({ email });
  if (!foundAdmin) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to access this route"
    );
  }

  const uuid1 = uuid.v1();
  const uuidLink = `https://parlour-frontend.vercel.app/admin/passwordchange/${uuid1}`;

  const sendMail = await sendMailJetEmail({
    reciverEmail: email,
    reciverName: foundAdmin.name,
    emailPurpose: "resetPassword",
    uuidLink,
  });

  if (sendMail !== 200) {
    throw new CustomError.BadRequestError(
      "Something went wrong, Please try again email"
    );
  }
  const updateLinkDB = await User.findOneAndUpdate(
    { email },
    { forgotPassword: uuid1 }
  );
  if (!updateLinkDB) {
    throw new CustomError.BadRequestError(
      "Somthing went wrong, please try again"
    );
  }
  res.status(201).json({ success: true });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  const deleteUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    throw new CustomError.BadRequestError(
      "Something went wrong, please try again"
    );
  }
  res.status(201).json({ success: true });
};

exports.saveBlog = async (req, res) => {
  const { HTMLBody, title, blogImg, status } = req.body;
  const blog = await Blog.create({
    HTMLBody,
    title,
    blogImg,
    status,
  });
  if (!blog) {
    throw new CustomError.BadRequestError(
      "Something went wrong,please try again"
    );
  }
  res.status(201).json({ success: true });
};

exports.publishDraftedBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findByIdAndUpdate(blogId, { status: "published" });
  if (!blog) {
    throw new CustomError.BadRequestError(
      "Somthing went wrong, please try again"
    );
  }
  res.status(201).json({ success: true });
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) {
    throw new CustomError.BadRequestError(
      "Somthing went wrong, please try again"
    );
  }
  res.status(201).json({ success: true });
};

exports.getAlUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  // await User.deleteMany({});
  // const newArr = [];
  // newUsers.forEach((user, index) => {
  //   user.address = arr[index];
  //   newArr.push(user);
  // });
  // await User.insertMany(newArr);
  res.status(200).json({ users });
};

const arr = [
  "6/4, Police Station Road, Kalasipalyam",
  "Nrupathungardblr-2, Opp Town Hall, Nrupathunga Road",
  "Old Madras Rd, Krishnarajapuram",
  "#78, Basement11thcr1stmntemplerdbl03, Malleswaram",
  "487/a, 1st B Main Kanakapura Road, Near Jbs Nursing Home, Jayanagar",
  "119, Mittal Tower, B Wing Mg, M G Road",
  "126,2ndcrs,oppoldtolgate,mysrd,bl26, Mysore Road",
  "505 & 515, B Wing, Mittal Tower, M G Road",
  "S-307,no 47, Manipal Centre, Dickenson Road, Dickenson Road",
  "1, 1,blpetblr-53, Near Malabar Lodge, Balepet",
  "2703, 1st Floor, 11th Main, 4th Block, Jayanagar",
  "M-170, Laxminarayanapuram",
  "71, Kalyan Buld,subhas Complex, 71,kalyanbuld,subhascplx,averdblr-2, Avenue Road",
  "45,pnslyt,kalyanngr,blr-43, Kalyan Nagar",
  "33/1, Imperial Court, Cunningham Road",
  "123, Raheja Arcade, 1st Floor, Koramangala",
  "2477,16thfmnhaliindstgblr-8, Hal",
  "102e, Mittal Towers, 102e,mtltwr,mgrdblr-1, M G Road",
  "Mllwmblr-3, Malleshwaram",
  "P U Building, 1 Mg, M G Road",
  "77/1-12, J C Road, J C Road",
  "30/2, Shanthiroad,bangalore-27, Shanti Road",
  ",23, Archana Complex, Cellar Jc Road, J C Road",
  "1-2, Shopping Complex, 1 Floor, Vegetable Market, Jayanagar",
  "22, 80ftrd,khbclny,koramangalabglr95, Koramangala",
  "15/2, State Bank Road, St Marks Road",
  "18, Hospital Road, Near Menaka Theatre, Hospital Road",
  "30b, Journalist Colony, 2nd Cross, Journalist Colony",
  "F4, Gem Plaza, Infantry Road, Infantry Road",
  "327, Jumma Masjid Road, O P H Road",
  "111, Mittal Towers, 1 A Wing Mg Road, M G Road",
  "4/3, A M Road, Kalasipalyam",
  "#3, 80ftrd,koramangala,8blk,blr-095, Koramangala",
  "3, 4th Cross, J M Lane, Balepet",
  "205, 8th Cross, N R Colony",
  "1stph,peny,jallhallicrs,blr-58, Peenya Industrial Area",
  "A-357, 1 Stage, Peenya Industrial Area",
  "1-novvalmikingr1stmnrd1stcrs-26, Mysore Road",
  "16/1a, Av Road, Tsp Road, Opp Bus Stand, Kalasipalyam",
  "84/1, S T House, 1st Floor, Richmond Road",
  "B1,1flr,jyothicmplx,134/1,infrd,b-1, Infantry Road",
  "82, Wheelers Rd, Cox Town",
  "106,brigadegardens,19,churchst,blr1, Church Street",
  "142, Next Ro Jain Temple, Balepet Cross R T Street, Neat Venkateshwara Sweets, Balepet",
  "4thflroxfordhouserustambagwestblk17, Rustam Bagh",
  "483, Shwetha Mansion, Basement, Malleshwaram",
  "452, Cottonpet Road, O T C Road",
  "216, 47, B Wing, Mittal Towers, M G Road",
  "2nd Floor, Koramangala",
  "100, 7th Cross, Malleshwaram",
  "5, Jmg Lane, S P Road",
];

const newUsers = [
  {
    name: "Blaire Theodore",
    email: "btheodore0@jimdo.com",
    address: "4019 Sunbrook Circle",
    gender: "Female",
    phoneNo: "6691794754",
    profileImg: "http://dummyimage.com/170x100.png/5fa2dd/ffffff",
  },
  {
    name: "Zahara Locke",
    email: "zlocke1@alexa.com",
    address: "1 Sunbrook Circle",
    gender: "Female",
    phoneNo: "7134210558",
    profileImg: "http://dummyimage.com/129x100.png/dddddd/000000",
  },
  {
    name: "Saw Fane",
    email: "sfane2@whitehouse.gov",
    address: "35 Bluejay Point",
    gender: "Male",
    phoneNo: "7763373138",
    profileImg: "http://dummyimage.com/178x100.png/ff4444/ffffff",
  },
  {
    name: "Tarrance Le Marquis",
    email: "tle3@bbb.org",
    address: "7577 Summer Ridge Junction",
    gender: "Male",
    phoneNo: "1725868727",
    profileImg: "http://dummyimage.com/137x100.png/dddddd/000000",
  },
  {
    name: "Wells Ingolotti",
    email: "wingolotti4@wsj.com",
    address: "49 Old Shore Hill",
    gender: "Male",
    phoneNo: "6344553833",
    profileImg: "http://dummyimage.com/119x100.png/cc0000/ffffff",
  },
  {
    name: "Mavra Dunstone",
    email: "mdunstone5@boston.com",
    address: "94 Washington Park",
    gender: "Female",
    phoneNo: "4063816951",
    profileImg: "http://dummyimage.com/131x100.png/cc0000/ffffff",
  },
  {
    name: "Tiler Latore",
    email: "tlatore6@vk.com",
    address: "162 Fairview Alley",
    gender: "Male",
    phoneNo: "6803196270",
    profileImg: "http://dummyimage.com/169x100.png/cc0000/ffffff",
  },
  {
    name: "Zitella Cauthra",
    email: "zcauthra7@rediff.com",
    address: "4743 Mandrake Trail",
    gender: "Female",
    phoneNo: "3041804177",
    profileImg: "http://dummyimage.com/239x100.png/dddddd/000000",
  },
  {
    name: "Marsha Corcoran",
    email: "mcorcoran8@ifeng.com",
    address: "8 Surrey Lane",
    gender: "Female",
    phoneNo: "9037492158",
    profileImg: "http://dummyimage.com/218x100.png/5fa2dd/ffffff",
  },
  {
    name: "Felix Abella",
    email: "fabella9@vk.com",
    address: "94 Clemons Junction",
    gender: "Male",
    phoneNo: "4515288828",
    profileImg: "http://dummyimage.com/210x100.png/ff4444/ffffff",
  },
  {
    name: "Lebbie Robjohns",
    email: "lrobjohnsa@homestead.com",
    address: "5380 Sage Place",
    gender: "Non-binary",
    phoneNo: "7618563681",
    profileImg: "http://dummyimage.com/111x100.png/ff4444/ffffff",
  },
  {
    name: "Wenda Purkis",
    email: "wpurkisb@bloomberg.com",
    address: "4475 Forest Circle",
    gender: "Female",
    phoneNo: "6947705680",
    profileImg: "http://dummyimage.com/123x100.png/5fa2dd/ffffff",
  },
  {
    name: "Vail Sangwin",
    email: "vsangwinc@hibu.com",
    address: "43569 8th Trail",
    gender: "Bigender",
    phoneNo: "8565220645",
    profileImg: "http://dummyimage.com/163x100.png/cc0000/ffffff",
  },
  {
    name: "Anderson Bunton",
    email: "abuntond@china.com.cn",
    address: "1095 Sachs Drive",
    gender: "Male",
    phoneNo: "2938135564",
    profileImg: "http://dummyimage.com/172x100.png/5fa2dd/ffffff",
  },
  {
    name: "Laughton Drife",
    email: "ldrifee@vkontakte.ru",
    address: "45 Elka Drive",
    gender: "Male",
    phoneNo: "6469055705",
    profileImg: "http://dummyimage.com/183x100.png/ff4444/ffffff",
  },
  {
    name: "Phyllis Phillps",
    email: "pphillpsf@weebly.com",
    address: "13704 Hallows Crossing",
    gender: "Female",
    phoneNo: "6983233340",
    profileImg: "http://dummyimage.com/170x100.png/cc0000/ffffff",
  },
  {
    name: "Farris Arnoldi",
    email: "farnoldig@independent.co.uk",
    address: "81 Golden Leaf Trail",
    gender: "Male",
    phoneNo: "4836941363",
    profileImg: "http://dummyimage.com/112x100.png/5fa2dd/ffffff",
  },
  {
    name: "Loleta McCreedy",
    email: "lmccreedyh@omniture.com",
    address: "74988 Nobel Plaza",
    gender: "Female",
    phoneNo: "5399064938",
    profileImg: "http://dummyimage.com/170x100.png/5fa2dd/ffffff",
  },
  {
    name: "Natassia Charkham",
    email: "ncharkhami@hp.com",
    address: "975 East Plaza",
    gender: "Female",
    phoneNo: "8302586564",
    profileImg: "http://dummyimage.com/135x100.png/dddddd/000000",
  },
  {
    name: "Hilliard Matfield",
    email: "hmatfieldj@clickbank.net",
    address: "879 7th Junction",
    gender: "Agender",
    phoneNo: "9547884965",
    profileImg: "http://dummyimage.com/220x100.png/cc0000/ffffff",
  },
  {
    name: "Gran Jevon",
    email: "gjevonk@techcrunch.com",
    address: "127 Merry Court",
    gender: "Male",
    phoneNo: "6744330122",
    profileImg: "http://dummyimage.com/113x100.png/5fa2dd/ffffff",
  },
  {
    name: "Guillermo Juschka",
    email: "gjuschkal@barnesandnoble.com",
    address: "8 Mayer Street",
    gender: "Male",
    phoneNo: "8683856215",
    profileImg: "http://dummyimage.com/239x100.png/ff4444/ffffff",
  },
  {
    name: "Philly Primak",
    email: "pprimakm@bandcamp.com",
    address: "04 Briar Crest Road",
    gender: "Female",
    phoneNo: "6963774811",
    profileImg: "http://dummyimage.com/235x100.png/ff4444/ffffff",
  },
  {
    name: "Agnella Potapczuk",
    email: "apotapczukn@whitehouse.gov",
    address: "76722 Sage Point",
    gender: "Female",
    phoneNo: "6071283459",
    profileImg: "http://dummyimage.com/208x100.png/dddddd/000000",
  },
  {
    name: "Bobbe Hoyle",
    email: "bhoyleo@sphinn.com",
    address: "10 Mallory Plaza",
    gender: "Female",
    phoneNo: "1704620514",
    profileImg: "http://dummyimage.com/122x100.png/5fa2dd/ffffff",
  },
  {
    name: "Adrien Cahan",
    email: "acahanp@engadget.com",
    address: "2471 Pearson Avenue",
    gender: "Male",
    phoneNo: "3183525146",
    profileImg: "http://dummyimage.com/206x100.png/cc0000/ffffff",
  },
  {
    name: "Clair Orrom",
    email: "corromq@myspace.com",
    address: "8624 Forest Dale Plaza",
    gender: "Female",
    phoneNo: "8055548107",
    profileImg: "http://dummyimage.com/186x100.png/ff4444/ffffff",
  },
  {
    name: "Tito Gravy",
    email: "tgravyr@jimdo.com",
    address: "40359 Prentice Hill",
    gender: "Male",
    phoneNo: "6543786461",
    profileImg: "http://dummyimage.com/123x100.png/dddddd/000000",
  },
  {
    name: "Ralf Finan",
    email: "rfinans@umich.edu",
    address: "6 Gerald Hill",
    gender: "Male",
    phoneNo: "6816924221",
    profileImg: "http://dummyimage.com/231x100.png/cc0000/ffffff",
  },
  {
    name: "Wyatan Gresswell",
    email: "wgresswellt@cornell.edu",
    address: "43 Mandrake Hill",
    gender: "Male",
    phoneNo: "5367939495",
    profileImg: "http://dummyimage.com/153x100.png/ff4444/ffffff",
  },
  {
    name: "Alanna Ruste",
    email: "arusteu@oakley.com",
    address: "4 Bowman Avenue",
    gender: "Female",
    phoneNo: "1771630016",
    profileImg: "http://dummyimage.com/245x100.png/cc0000/ffffff",
  },
  {
    name: "Herold Curm",
    email: "hcurmv@disqus.com",
    address: "58877 Ohio Terrace",
    gender: "Male",
    phoneNo: "8003869277",
    profileImg: "http://dummyimage.com/159x100.png/ff4444/ffffff",
  },
  {
    name: "Whitney Muehler",
    email: "wmuehlerw@washington.edu",
    address: "9 Cherokee Way",
    gender: "Male",
    phoneNo: "7113857985",
    profileImg: "http://dummyimage.com/246x100.png/ff4444/ffffff",
  },
  {
    name: "Mar Cubley",
    email: "mcubleyx@nasa.gov",
    address: "0866 Scofield Alley",
    gender: "Male",
    phoneNo: "8303670136",
    profileImg: "http://dummyimage.com/200x100.png/5fa2dd/ffffff",
  },
  {
    name: "Pier Mansbridge",
    email: "pmansbridgey@washingtonpost.com",
    address: "854 Vera Terrace",
    gender: "Female",
    phoneNo: "7844717692",
    profileImg: "http://dummyimage.com/115x100.png/cc0000/ffffff",
  },
  {
    name: "Gregorio Allom",
    email: "gallomz@sciencedaily.com",
    address: "883 Prentice Place",
    gender: "Male",
    phoneNo: "7116976635",
    profileImg: "http://dummyimage.com/158x100.png/cc0000/ffffff",
  },
  {
    name: "Tracie Stubbley",
    email: "tstubbley10@spiegel.de",
    address: "3680 Sauthoff Road",
    gender: "Female",
    phoneNo: "9261139632",
    profileImg: "http://dummyimage.com/176x100.png/ff4444/ffffff",
  },
  {
    name: "Abigail Coysh",
    email: "acoysh11@wp.com",
    address: "80389 Rutledge Parkway",
    gender: "Female",
    phoneNo: "3862195622",
    profileImg: "http://dummyimage.com/227x100.png/5fa2dd/ffffff",
  },
  {
    name: "Abagael Whibley",
    email: "awhibley12@quantcast.com",
    address: "07919 Shasta Plaza",
    gender: "Female",
    phoneNo: "8363580247",
    profileImg: "http://dummyimage.com/142x100.png/dddddd/000000",
  },
  {
    name: "Florinda Nisot",
    email: "fnisot13@cornell.edu",
    address: "07 Barby Terrace",
    gender: "Female",
    phoneNo: "2895464066",
    profileImg: "http://dummyimage.com/228x100.png/dddddd/000000",
  },
  {
    name: "Wilmer Thom",
    email: "wthom14@wiley.com",
    address: "277 Farwell Terrace",
    gender: "Male",
    phoneNo: "5666902981",
    profileImg: "http://dummyimage.com/114x100.png/5fa2dd/ffffff",
  },
  {
    name: "Natalina Nacey",
    email: "nnacey15@globo.com",
    address: "03 Weeping Birch Crossing",
    gender: "Female",
    phoneNo: "1268253004",
    profileImg: "http://dummyimage.com/250x100.png/dddddd/000000",
  },
  {
    name: "Kiel Quartley",
    email: "kquartley16@scribd.com",
    address: "1 New Castle Point",
    gender: "Male",
    phoneNo: "5991443067",
    profileImg: "http://dummyimage.com/110x100.png/dddddd/000000",
  },
  {
    name: "Man Mackilpatrick",
    email: "mmackilpatrick17@cpanel.net",
    address: "43691 6th Circle",
    gender: "Male",
    phoneNo: "9824175932",
    profileImg: "http://dummyimage.com/177x100.png/ff4444/ffffff",
  },
  {
    name: "Marcelo Richie",
    email: "mrichie18@fema.gov",
    address: "10038 Cordelia Court",
    gender: "Male",
    phoneNo: "6214274248",
    profileImg: "http://dummyimage.com/214x100.png/ff4444/ffffff",
  },
  {
    name: "Sherm Sagar",
    email: "ssagar19@is.gd",
    address: "975 Montana Drive",
    gender: "Male",
    phoneNo: "5995818787",
    profileImg: "http://dummyimage.com/198x100.png/cc0000/ffffff",
  },
  {
    name: "Joel Hollingdale",
    email: "jhollingdale1a@imgur.com",
    address: "3 Twin Pines Alley",
    gender: "Male",
    phoneNo: "8256569820",
    profileImg: "http://dummyimage.com/239x100.png/dddddd/000000",
  },
  {
    name: "Alexandros Jepps",
    email: "ajepps1b@blogs.com",
    address: "6007 Tennessee Street",
    gender: "Male",
    phoneNo: "6572995416",
    profileImg: "http://dummyimage.com/226x100.png/ff4444/ffffff",
  },
  {
    name: "Storm Duchasteau",
    email: "sduchasteau1c@ucsd.edu",
    address: "11 Brentwood Road",
    gender: "Non-binary",
    phoneNo: "4412823479",
    profileImg: "http://dummyimage.com/149x100.png/dddddd/000000",
  },
  {
    name: "Joshia Cerie",
    email: "jcerie1d@prlog.org",
    address: "251 Duke Alley",
    gender: "Male",
    phoneNo: "8779807884",
    profileImg: "http://dummyimage.com/176x100.png/ff4444/ffffff",
  },
];
