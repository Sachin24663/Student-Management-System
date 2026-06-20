const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  department_id: { type: String, unique: true },
  department_name: { type: String, required: true, unique: true },
  hod: { type: String, required: true },
});

// Auto-generate Department ID (DEP001, DEP002, etc.)
departmentSchema.pre("save", async function (next) {
  if (this.department_id) return next();

  try {
    const lastDept = await mongoose
      .model("Department")
      .findOne({}, {}, { sort: { _id: -1 } });
    let nextNumber = 1;
    if (lastDept && lastDept.department_id) {
      const lastNum = parseInt(lastDept.department_id.replace("DEP", ""), 10);
      nextNumber = lastNum + 1;
    }
    this.department_id = `DEP${String(nextNumber).padStart(3, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Department", departmentSchema);
