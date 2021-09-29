import "./AddProp.css";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import Dropdown from "react-dropdown";

export default function AddProp() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const [address, setAddress] = useState("");
  const [charges, setCharges] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState("");
  const [options, setoptions] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      const res = await axios.get("/spots/");
      let cat = [];
      for (let i = 0; i < res.data.length; i++) {
        cat.push(res.data[i].title);
      }
      setoptions(cat);
    };
    fetchSpots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
      address,
      charges,
      city,
      categories,
      phone,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {}
  };
  return (
    <div className="addprop">
      {file && (
        <img className="addpropImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="addpropForm" onSubmit={handleSubmit}>
        <div className="addpropFormGroup">
          <label htmlFor="fileInput">
            <i className="addpropIcon fas fa-plus"></i>
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            className="addpropInput"
            placeholder="Title"
            type="text"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="addpropFormGroup">
          <textarea
            placeholder="Write about your Property..."
            type="text"
            className="addpropInput addpropText"
            // autoFocus={flase}}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="addpropFormGroup1">
          <input
            type="text"
            className="addpropInput addpropText1"
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
          />
          {/* <br /> */}
          <Dropdown
            className="dropdown addpropInput addpropText1 "
            menuClassName="dropdown-content"
            onChange={(e) => setCategories(e.value)}
            options={options}
            placeholder="Select Spot"
          />
        </div>
        <div className="addpropFormGroup1">
          <input
            type="text"
            className="addpropInput addpropText1"
            placeholder="Charges"
            onChange={(e) => setCharges(e.target.value)}
          />
          <br />
          <input
            type="text"
            className="addpropInput addpropText1 "
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
          />
          <br />
        </div>
        <div className="addpropFormGroup1">
          <input
            type="text"
            className="addpropInput addpropText1 "
            placeholder="Enter Contact No."
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
        </div>
      </form>
      <button className="addSub" type="submit">
        SAVE
      </button>
    </div>
  );
}
