import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import api from "../../APIs/apiService";
import { useApiPromise } from "../../Hooks/useApi";

const sampleElections = [
  {
    election_id: 1,
    organization_name: "College Student Council",
    election_start: "2025-10-01",
    election_end: "2025-10-10",
    active: 1,
    about_organization: "Represents students in academic affairs.",
  },
  {
    election_id: 2,
    organization_name: "Tech Club Election",
    election_start: "2025-11-01",
    election_end: "2025-11-03",
    active: 0,
    about_organization: "Encourages innovation and technical growth.",
  },
];

const sampleVotes = [
  { vote_id: 1, election_id: 1, post_id: 12, candidate_id: 4 },
  { vote_id: 2, election_id: 1, post_id: 12, candidate_id: 4 },
  { vote_id: 3, election_id: 2, post_id: 13, candidate_id: 8 },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [elections, setElections] = useState([]);
  const [votes, setVotes] = useState([]);
  const [importPreview, setImportPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const { loading, error, run } = useApiPromise();
  const { loading: electionLoading, error: electionError, run: electionrun } = useApiPromise();
  const { loading: votefetchLoading, error: votefetchError, run: voteFetchRun } = useApiPromise();

  useEffect(() => {
    const fetchElection = async () => {
      const response = await electionrun(() => api.get('/admin/elections', { withCredentials: true, token: false, retryOnAuthFail: false }));
      setElections(response.data);
    }
    fetchElection();
  }, []);


  useEffect(() => {
    const fetchVoteCounts = async (electionIds) => {
      try {
        const idsParam = electionIds.join(",");

        
        const res = await voteFetchRun( ()=>api.get(`/admin/votesCount?ids=${idsParam}`, { withCredentials: true, token: false, retryOnAuthFail: false }));
        console.log("Vote counts:", res.data.data);
        setVotes(res.data);
      } catch (err) {
        console.error("Error fetching vote counts:", err.response?.data || err.message);
      }
    };

     if (elections && elections.length > 0) {
 
    const electionIds = elections.map((e) => e.election_id);
    fetchVoteCounts(electionIds);
  }

  }, [elections])









  const handleCSVImport = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setImportPreview({
          type,
          fileName: file.name,
          data: results.data,
        });
      },
    });

    e.target.value = "";
  };

  const applyImport = async () => {
    if (!importPreview) return;
    const { type, data } = importPreview;
    console.log(data)
    const result = await run(() =>
      api.post(`/admin/import/${type}`, { rows: data }, { withCredentials: true, token: false, retryOnAuthFail: false })
    )
    alert('Successfully add', result.data.inserted);

    setImportPreview(null);
  };

  const toggleElectionActive = (id) => {
    setElections((prev) =>
      prev.map((e) =>
        e.election_id === id ? { ...e, active: e.active ? 0 : 1 } : e
      )
    );
  };

  const startEditing = (election) => {
    setEditing({ ...election });
  };

  const saveEditing = () => {
    setElections((prev) =>
      prev.map((e) =>
        e.election_id === editing.election_id ? editing : e
      )
    );
    setEditing(null);
  };

  const deleteElection = (id) => {
    if (!window.confirm("Are you sure you want to delete this election?"))
      return;
    setElections((prev) => prev.filter((e) => e.election_id !== id));
  };

  const voteCountsForElection = (id) => {
    const filtered = votes.filter((v) => v.election_id === id);
    const counts = {};
    filtered.forEach((v) => {
      const key = v.post_id || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  const activeElections = elections.filter((e) => e.active === 1);
  const inactiveElections = elections.filter((e) => e.active === 0);

  return (
    <section id="adminpanel" className="bg-bg min-h-screen py-8">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-72 rounded-lg shadow-card p-4 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-alwaysWhite font-semibold">
                AD
              </div>
              <div>
                <h3 className="text-base font-semibold">Admin Panel</h3>
                <p className="text-sm opacity-80">Manage Elections & Votes</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {["dashboard"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left w-full px-3 py-2 rounded-md font-medium transition-all ${activeTab === tab
                    ? "bg-primary text-alwaysWhite"
                    : "bg-white text-text border border-gray hover:bg-gray"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </aside>

          {/* ============== MAIN ============== */}
          <main className="flex-1 space-y-6 bg-white rounded-sm p-2">

            <div className="rounded-lg p-4  flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Elections Dashboard</h2>
                <p className="text-sm opacity-80">
                  Overview and quick actions
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { label: "Candidates", color: "bg-primary" },
                  { label: "Posts", color: "bg-secondary" },
                  { label: "Voters", color: "bg-success" },
                ].map(({ label, color }) => (
                  <label
                    key={label}
                    className={`btn cursor-pointer ${color}`}
                  >
                    Import {label}
                    <input
                      onChange={(e) =>
                        handleCSVImport(e, label.toLowerCase())
                      }
                      accept=".csv,.txt"
                      type="file"
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* CSV PREVIEW */}
            {importPreview && (
              <div className="rounded-lg  p-4 ">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold">
                      Import Preview: {importPreview.fileName}
                    </h3>
                    <p className="text-sm opacity-70">
                      Type: {importPreview.type} • Rows:{" "}
                      {importPreview.data.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImportPreview(null)}
                      className="btn bg-error"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyImport}
                      className="btn bg-primary text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs opacity-80">
                      <tr>
                        {Object.keys(importPreview.data[0] || {})
                          .slice(0, 6)
                          .map((h) => (
                            <th key={h} className="p-2">
                              {h}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.data.slice(0, 6).map((row, idx) => (
                        <tr key={idx} className="border-t">
                          {Object.keys(row)
                            .slice(0, 6)
                            .map((k) => (
                              <td key={k} className="p-2">
                                {row[k]}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ELECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Elections */}
              <div className="rounded-lg  p-4">
                <h3 className="font-semibold mb-3">
                  Active Elections ({activeElections.length})
                </h3>
                <div className="space-y-3">
                  {activeElections.length === 0 ? (
                    <p className="text-sm opacity-70">No active elections</p>
                  ) : (
                    activeElections.map((el) => (
                      <div
                        key={el.election_id}
                        className="p-3 border border-gray rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      >
                        <div>
                          <h4 className="font-semibold mb-2">
                            {el.organization_name}
                          </h4>
                          <p className="text-sm opacity-80">
                            {el.election_start} → {el.election_end}
                          </p>
                          <p className="text-sm opacity-70 mt-1">
                            {el.about_organization}
                          </p>
                        </div>
                        {/* <div className="flex gap-2">
                          <button
                            onClick={() => toggleElectionActive(el.election_id)}
                            className="btn bg-warning"
                          >
                            Stop
                          </button>
                          <button
                            onClick={() => startEditing(el)}
                            className="btn bg-primary text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteElection(el.election_id)}
                            className="btn bg-error"
                          >
                            Delete
                          </button>
                        </div> */}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Inactive Elections */}
              <div className="rounded-lg  p-4 ">
                <h3 className="font-semibold mb-3">
                  Inactive Elections ({inactiveElections.length})
                </h3>
                <div className="space-y-3">
                  {inactiveElections.length === 0 ? (
                    <p className="text-sm opacity-70">No inactive elections</p>
                  ) : (
                    inactiveElections.map((el) => (
                      <div
                        key={el.election_id}
                        className="p-3 border border-gray rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {el.organization_name}
                          </h4>
                          <p className="text-sm opacity-80">
                            {el.election_start} → {el.election_end}
                          </p>
                        </div>
                        {/* <div className="flex gap-2">
                          <button
                            onClick={() => toggleElectionActive(el.election_id)}
                            className="btn bg-success"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => startEditing(el)}
                            className="btn bg-primary text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteElection(el.election_id)}
                            className="btn bg-error"
                          >
                            Delete
                          </button>
                        </div> */}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* VOTE COUNTS */}
            <div className="rounded-lg shadow-card p-4 bg-white">
              <h3 className="font-semibold mb-3">Vote Count Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {elections.map((el) => {
                  const counts = voteCountsForElection(el.election_id);
                  const total = Object.values(counts).reduce(
                    (a, b) => a + b,
                    0
                  );
                  return (
                    <div
                      key={el.election_id}
                      className="p-3 border rounded-md bg-gray"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {el.organization_name}
                        </h4>
                        <span className="text-sm font-medium">
                          {total} votes
                        </span>
                      </div>
                      <div className="text-xs opacity-80">
                        {Object.keys(counts).length === 0 && <p>No votes</p>}
                        {Object.entries(counts).map(([post, cnt]) => (
                          <div
                            key={post}
                            className="flex justify-between py-1 border-b border-bg"
                          >
                            <span>Post {post}</span>
                            <span>{cnt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EDIT ELECTION */}
            {editing && (
              <div className="rounded-lg shadow-card p-4 bg-white">
                <h3 className="font-semibold mb-3">
                  Edit: {editing.organization_name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm">Organization</label>
                    <input
                      value={editing.organization_name}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          organization_name: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded-md border border-bg"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Start Date</label>
                    <input
                      type="date"
                      value={editing.election_start}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          election_start: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded-md border border-bg"
                    />
                  </div>
                  <div>
                    <label className="text-sm">End Date</label>
                    <input
                      type="date"
                      value={editing.election_end}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          election_end: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded-md border border-bg"
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={saveEditing}
                    className="btn bg-primary text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="btn bg-gray"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
