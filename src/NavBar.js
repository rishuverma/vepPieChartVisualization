import React, { useState } from "react";
import axios from "axios";
import PieChart from "./PieChart";
const NavBar = () => {
  const [species, setSpecies] = useState("");
  const [response, setResonse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consequence, setConsequence] = useState({});
  const [dataForPieChart, setDataForPieChart] = useState("");
  const [error, setError] = useState(false);
  let chartData = "";
  const handleDropdown = (e) => {
    console.log(e.target.value, e.target.text);
    setSpecies(e.target.text);
  };
  const dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  const handleSubmitRequest = async () => {
    try {
      setLoading(true);
      let idArray = document.getElementById("variant_ids").value.split("\n");
      idArray = idArray
        .filter((eachId) => {
          if (eachId) return true;
          return false;
        })
        .map((eachId) => {
          return eachId.trim();
        });
      let reqData = {
        ids: idArray,
      };
      console.log("hey ids", idArray);
      let vepUri = `https://rest.ensembl.org/vep/${species}/id`;
      let responseVEP = await axios.post(vepUri, reqData);
      setLoading(false);
      for (let eachObjOfResponse of responseVEP.data) {
        for (let eachTranscript of eachObjOfResponse.transcript_consequences) {
          for (let eachConsequenceTerm of eachTranscript.consequence_terms) {
            if (consequence[eachConsequenceTerm])
              consequence[eachConsequenceTerm]++;
            else consequence[eachConsequenceTerm] = 1;
            // consequence.total++;
          }
        }
      }
      setConsequence(consequence);
      console.log(consequence);
      let labels = [];
      let data = [];
      let backgroundColor = [];
      for (let eachLabel in consequence) {
        if (eachLabel !== "total") labels.push(eachLabel);
        data.push(consequence[eachLabel]);
        backgroundColor.push(dynamicColors());
      }
      chartData = {
        labels,
        datasets: [
          {
            label: "consequence terms",
            data,
            backgroundColor,
          },
        ],
      };
      setDataForPieChart(chartData);

      console.log("this is it", dataForPieChart, chartData);
    } catch (err) {
      console.log("error while sending req", err);
      setError(true);
    }
  };
  return (
    <div className="container-fluid">
      <div
        className="navbar navbar-light bg-light"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {species ? species : "Select Species"}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <option
              className="dropdown-item"
              value="homo_sapiens"
              text="Homo Sapiens"
              onClick={(e) => {
                handleDropdown(e);
              }}
            >
              Homo Sapiens
            </option>
          </div>
        </div>
        <div className="form-group">
          <label for="variant_ids">
            <strong>Enter variant identifiers</strong>
          </label>
          <textarea
            className="form-control rounded-0"
            id="variant_ids"
            rows="3"
          ></textarea>
          <div style={{ marginLeft: "110%", marginTop: "-18%" }}>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSubmitRequest()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {loading && !error ? (
        <center>
          {" "}
          <h3>Loading...</h3>
        </center>
      ) : (
        ""
      )}
      {dataForPieChart && !loading ? (
        <PieChart dataForPieChart={dataForPieChart} />
      ) : (
        ""
      )}
    </div>
  );
};
export default NavBar;
