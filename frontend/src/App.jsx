import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // =========================
  // STATE
  // =========================

  // Store all job applications
  const [jobs, setJobs] = useState([]);

  // Store which job is being edited
  const [editingId, setEditingId] = useState(null);

  // Search text
  const [search, setSearch] = useState("");

  // Status filter
  const [statusFilter, setStatusFilter] = useState("All");

  // Form data
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied",
    application_date: "",
    salary: "",
    job_url: "",
    notes: "",
  });


  // =========================
  // FETCH JOBS
  // =========================

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/jobs"
      );

      setJobs(response.data);

    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error
      );
    }
  };


  // Fetch jobs when page loads
  useEffect(() => {
    fetchJobs();
  }, []);


  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const shortlistedJobs = jobs.filter(
    (job) => job.status === "Shortlisted"
  ).length;

  const interviewJobs = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const selectedJobs = jobs.filter(
    (job) => job.status === "Selected"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;


  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const company =
      job.company?.toLowerCase() || "";

    const position =
      job.position?.toLowerCase() || "";

    const matchesSearch =
      company.includes(searchText) ||
      position.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      company: "",
      position: "",
      status: "Applied",
      application_date: "",
      salary: "",
      job_url: "",
      notes: "",
    });
  };


  // =========================
  // ADD / UPDATE JOB
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const jobData = {
      company: formData.company,
      position: formData.position,
      status: formData.status,
      application_date:
        formData.application_date,

      salary: formData.salary
        ? Number(formData.salary)
        : null,

      job_url:
        formData.job_url || null,

      notes:
        formData.notes || null,
    };

    try {

      // =====================
      // UPDATE
      // =====================

      if (editingId) {

        const response =
          await axios.put(
            `http://127.0.0.1:8000/jobs/${editingId}`,
            jobData
          );

        console.log(
          "Job updated:",
          response.data
        );

        alert(
          "Job application updated successfully!"
        );

      }

      // =====================
      // CREATE
      // =====================

      else {

        const response =
          await axios.post(
            "http://127.0.0.1:8000/jobs",
            jobData
          );

        console.log(
          "Job added:",
          response.data
        );

        alert(
          "Job application added successfully!"
        );
      }


      // Refresh list
      await fetchJobs();

      // Clear form
      resetForm();

    } catch (error) {

      console.error(
        "Error saving job:",
        error
      );

      alert(
        "Failed to save job application."
      );
    }
  };


  // =========================
  // EDIT JOB
  // =========================

  const editJob = (job) => {

    setEditingId(job.id);

    setFormData({
      company: job.company || "",
      position: job.position || "",
      status: job.status || "Applied",

      application_date:
        job.application_date || "",

      salary:
        job.salary ?? "",

      job_url:
        job.job_url ?? "",

      notes:
        job.notes ?? "",
    });


    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // DELETE JOB
  // =========================

  const deleteJob = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job application?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await axios.delete(
        `http://127.0.0.1:8000/jobs/${id}`
      );

      alert(
        "Job application deleted successfully!"
      );

      await fetchJobs();

    } catch (error) {

      console.error(
        "Error deleting job:",
        error
      );

      alert(
        "Failed to delete job application."
      );
    }
  };


  // =========================
  // UI
  // =========================

  return (

    <div className="container py-5">


      {/* =========================
          HEADER
      ========================= */}

      <div className="text-center mb-5" >

        <h1 className="fw-bold"style={{ color: "black" }}>
          Job Application Tracker
        </h1>

        <p className="text-muted">
          Track and manage your job applications
        </p>

      </div>



      {/* =========================
          DASHBOARD
      ========================= */}

      <div className="row mb-4">


        {/* Total */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Total
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {totalJobs}
              </h2>

            </div>

          </div>

        </div>


        {/* Applied */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Applied
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {appliedJobs}
              </h2>

            </div>

          </div>

        </div>


        {/* Shortlisted */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Shortlisted
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {shortlistedJobs}
              </h2>

            </div>

          </div>

        </div>


        {/* Interview */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Interview
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {interviewJobs}
              </h2>

            </div>

          </div>

        </div>


        {/* Selected */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Selected
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {selectedJobs}
              </h2>

            </div>

          </div>

        </div>


        {/* Rejected */}

        <div className="col-md-4 col-lg-2 mb-3">

          <div className="card shadow-sm text-center h-100">

            <div className="card-body">

              <h6 className="text-muted">
                Rejected
              </h6>

              <h2 className="fw-bold"style={{ color: "black" }}>
                {rejectedJobs}
              </h2>

            </div>

          </div>

        </div>

      </div>



      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      <div className="card shadow-sm">

        <div className="card-header">

          <h4 className="mb-0">

            {editingId
              ? "Edit Job Application"
              : "Add Job Application"}

          </h4>

        </div>


        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">


              {/* Company */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Position */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  className="form-control"
                  placeholder="e.g. Python Developer"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Status */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Shortlisted">
                    Shortlisted
                  </option>

                  <option value="Interview">
                    Interview
                  </option>

                  <option value="Selected">
                    Selected
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

              </div>


              {/* Application Date */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Application Date
                </label>

                <input
                  type="date"
                  name="application_date"
                  className="form-control"
                  value={
                    formData.application_date
                  }
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Salary */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Expected Salary
                </label>

                <input
                  type="number"
                  name="salary"
                  className="form-control"
                  placeholder="e.g. 600000"
                  value={formData.salary}
                  onChange={handleChange}
                />

              </div>


              {/* Job URL */}

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Job URL
                </label>

                <input
                  type="url"
                  name="job_url"
                  className="form-control"
                  placeholder="https://example.com/job"
                  value={formData.job_url}
                  onChange={handleChange}
                />

              </div>


              {/* Notes */}

              <div className="col-12 mb-3">

                <label className="form-label">
                  Notes
                </label>

                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  placeholder="Add notes..."
                  value={formData.notes}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* Buttons */}

            <button
              type="submit"
              className="btn btn-primary me-2"
            >

              {editingId
                ? "Update Job Application"
                : "Add Job Application"}

            </button>


            {editingId && (

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </form>

        </div>

      </div>



      {/* =========================
          JOB APPLICATION LIST
      ========================= */}

      <div className="card shadow-sm mt-5">


        <div className="card-header">

          <h4 className="mb-0">
            Job Applications
          </h4>

        </div>


        <div className="card-body">


          {/* =========================
              SEARCH + FILTER
          ========================= */}

          <div className="row mb-4">


            {/* Search */}

            <div className="col-md-8 mb-3">

              <input
                type="text"
                className="form-control"
                placeholder="Search by company or position..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            {/* Status Filter */}

            <div className="col-md-4 mb-3">

              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Applied">
                  Applied
                </option>

                <option value="Shortlisted">
                  Shortlisted
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>

          </div>



          {/* =========================
              TABLE
          ========================= */}

          <div className="table-responsive">

            <table className="table table-hover align-middle">


              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Company
                  </th>

                  <th>
                    Position
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Applied Date
                  </th>

                  <th>
                    Salary
                  </th>

                  <th>
                    Job Link
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredJobs.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center text-muted py-4"
                    >
                      No matching job applications found
                    </td>

                  </tr>

                ) : (

                  filteredJobs.map((job) => (

                    <tr key={job.id}>


                      {/* ID */}

                      <td>
                        {job.id}
                      </td>


                      {/* Company */}

                      <td>
                        {job.company}
                      </td>


                      {/* Position */}

                      <td>
                        {job.position}
                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={`badge ${job.status === "Applied"
                              ? "bg-primary"
                              : job.status === "Shortlisted"
                                ? "bg-info"
                                : job.status === "Interview"
                                  ? "bg-warning text-dark"
                                  : job.status === "Selected"
                                    ? "bg-success"
                                    : "bg-danger"
                            }`}
                        >
                          {job.status}
                        </span>

                      </td>


                      {/* Date */}

                      <td>
                        {job.application_date}
                      </td>


                      {/* Salary */}

                      <td>

                        {job.salary
                          ? `₹${job.salary}`
                          : "Not specified"}

                      </td>


                      {/* Job URL */}

                      <td>

                        {job.job_url ? (

                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Job
                          </a>

                        ) : (

                          "No link"

                        )}

                      </td>


                      {/* Actions */}

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            editJob(job)
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteJob(job.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;