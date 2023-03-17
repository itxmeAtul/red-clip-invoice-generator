import React from "react";
import Delete from "./assets/icons/delete.svg";
import data from "./assets/data/companydata.json";
import axios from "axios";

const App = () => {
  const [showError, setShowError] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [formValues, setFormValues] = React.useState({
    recName: "",
    recAdd: "",
    invNo: "",
    invDate: "",
    remark: "",
  });
  const [totalCost, setTotalCost] = React.useState(0);
  const [refresh, setRefresh] = React.useState(false);

  function onAddItem(params) {
    let tempTableData = [...tableData];
    if (tempTableData.filter((xx) => xx.isEdit === true).length > 0) {
      setShowError(true);
    } else {
      let tempObj = {
        key: Math.random() * 100,
        desc: "",
        qty: "",
        amt: "",
        isEdit: true,
      };
      tempTableData.push(tempObj);
      setTableData(tempTableData);
    }
  }

  function deleteRecord(key) {
    setTableData([...tableData].filter((xx) => xx.key !== key));
    setRefresh(!refresh);
  }

  function onEditSave(key) {
    let tempTableData = [...tableData];
    let index = tableData.findIndex((xx) => xx.key === key);

    tempTableData[index].isEdit = false;
    setTableData(tempTableData);
    setRefresh(!refresh);
  }

  function onEditClick(key) {
    let tempTableData = [...tableData];
    let index = tableData.findIndex((xx) => xx.key === key);

    tempTableData[index].isEdit = true;
    setTableData(tempTableData);
  }

  React.useEffect(() => {
    // console.log(data, "data");
    let temptotalCost = 0;
    temptotalCost = tableData.reduce(
      (n, { amt }) => (n + amt ? parseFloat(amt) : 0),
      0
    );
    setTotalCost(temptotalCost);
  }, [refresh]);

  async function handleSave() {
    let finalData = {
      ...data,
      recName: formValues.recName,
      recAdd: formValues.recAdd,
      invNo: formValues.invNo,
      invDate: formValues.invDate,
      remark: formValues.remark,
      listOfItems: [],
      grandTotal: totalCost,
    };

    axios
      .post(
        "http://localhost:5000/generatePdf",
        { data: finalData },
        { responseType: "blob" }
      )
      .then((res) => {
        // console.log(res, "res");
        // return;
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    console.log(finalData, "finalData");
  }

  return (
    <>
      <div className="w-full max-w-2xl p-4  bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 md:mt-10">
        <div className="relative z-0 w-full mb-6 group flex justify-center">
          <div className="relative  overflow-hidden font-bold text-xl ">
            Invoice Generator
          </div>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            value={formValues.recName}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) =>
              setFormValues({ ...formValues, recName: e.target.value })
            }
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Reciepent Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={formValues.recAdd}
            onChange={(e) =>
              setFormValues({ ...formValues, recAdd: e.target.value })
            }
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Reciepent Address
          </label>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={formValues.invDate}
              onChange={(e) =>
                setFormValues({ ...formValues, invDate: e.target.value })
              }
            />
            <label
              htmlFor="floating_first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Invoice Date
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={formValues.invNo}
              onChange={(e) =>
                setFormValues({ ...formValues, invNo: e.target.value })
              }
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Invoice No.
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <input
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={formValues.remark}
            onChange={(e) =>
              setFormValues({ ...formValues, remark: e.target.value })
            }
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Remark
          </label>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 border dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" colSpan={9} className="px-6 py-3  ">
                  List of items
                </th>
                <th scope="col" className="px-6 py-3  ">
                  <p
                    data-modal-target="defaultModal"
                    data-modal-toggle="defaultModal"
                    onClick={onAddItem}
                    className="cursor-pointer text-blue-500"
                  >
                    Add Item
                  </p>
                  {/* <button
                    
                    className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                  >
                    Toggle modal
                  </button> */}
                </th>
              </tr>
              <tr className="border border-black-700">
                <th scope="col" colSpan={1} className="px-6 py-3">
                  #
                </th>
                <th scope="col" colSpan={6} className="px-6 py-3">
                  Particular
                </th>
                <th scope="col" colSpan={1} className="px-6 py-3">
                  Quantity/Size
                </th>
                <th scope="col" colSpan={1} className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" colSpan={1} className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((ele, idx) => {
                  return (
                    <tr
                      key={idx}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td colSpan={1} className="px-6 py-4">
                        {idx + 1}
                      </td>
                      <td colSpan={6} className="px-6 py-4">
                        {ele.isEdit ? (
                          <input
                            type="text"
                            value={ele.desc}
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                              let tempTableData = [...tableData];
                              let index = tableData.findIndex(
                                (xx) => xx.key === ele.key
                              );
                              tempTableData[index].desc = e.target.value;
                              setTableData(tempTableData);
                            }}
                          />
                        ) : (
                          `${ele.desc}`
                        )}
                      </td>
                      <td colSpan={1} className="px-6 py-4">
                        {ele.isEdit ? (
                          <input
                            type="number"
                            value={ele.qty}
                            // pattern="[0-9]{5}"
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                              let tempTableData = [...tableData];
                              let index = tableData.findIndex(
                                (xx) => xx.key === ele.key
                              );

                              tempTableData[index].qty = e.target.value;
                              setTableData(tempTableData);
                            }}
                          />
                        ) : (
                          `${ele.qty}`
                        )}
                      </td>
                      <td colSpan={1} className="px-6 py-4">
                        {ele.isEdit ? (
                          <input
                            type="number"
                            value={ele.amt}
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                              let tempTableData = [...tableData];
                              let index = tableData.findIndex(
                                (xx) => xx.key === ele.key
                              );

                              tempTableData[index].amt = e.target.value;
                              setTableData(tempTableData);
                            }}
                          />
                        ) : (
                          `${ele.amt}`
                        )}
                      </td>
                      <td colSpan={1} className="px-6 py-4 flex">
                        {!ele.isEdit ? (
                          <>
                            <p
                              className="mr-3 cursor-pointer"
                              onClick={() => deleteRecord(ele.key)}
                            >
                              <img className="w-4 h-4" src={Delete} />
                            </p>
                            <p
                              className="cursor-pointer"
                              onClick={() => onEditClick(ele.key)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
                              </svg>
                            </p>
                          </>
                        ) : (
                          <p
                            className="cursor-pointer"
                            onClick={() => onEditSave(ele.key)}
                          >
                            <svg
                              className=""
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z" />
                            </svg>
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={10} className="px-6 py-4">
                    Nothing to display
                  </td>
                </tr>
              )}
              <tr>
                <th scope="col" colSpan={8} className="px-6 py-3  ">
                  Grand Total
                </th>
                <th scope="col" colSpan={2} className="px-6 py-3  ">
                  {totalCost}
                </th>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="relative z-0 w-full mt-6  text-center group">
          <button
            type="submit"
            onClick={handleSave}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Generate Invoice
          </button>
        </div>
        {showError && (
          <div
            class="flex  p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              aria-hidden="true"
              class="flex-shrink-0 inline w-5 h-5 mr-3 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">Error!</span> Save data before adding
              new entry
            </div>
            <button
              type="button"
              class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
              data-dismiss-target="#alert-2"
              aria-label="Close"
              onClick={() => {
                setShowError(false);
              }}
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
