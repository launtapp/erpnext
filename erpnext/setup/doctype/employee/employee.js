// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext.setup");
erpnext.setup.EmployeeController = class EmployeeController extends frappe.ui.form.Controller {
	setup() {
		this.frm.fields_dict.user_id.get_query = function(doc, cdt, cdn) {
			return {
				query: "frappe.core.doctype.user.user.user_query",
				filters: {ignore_user_type: 1}
			}
		}
		this.frm.fields_dict.reports_to.get_query = function(doc, cdt, cdn) {
			return { query: "erpnext.controllers.queries.employee_query"} }
	}

	refresh() {
		erpnext.toggle_naming_series();
	}

	salutation() {
		if (this.frm.doc.salutation) {
			this.frm.set_value("gender", {
				"Mr": "Male",
				"Ms": "Female"
			}[this.frm.doc.salutation]);
		}
	}

};

frappe.ui.form.on("Employee", {
	onload: function (frm) {
		frm.set_query("department", function() {
			return {
				"filters": {
					"company": frm.doc.company,
				}
			};
		});
		// const tour_name = 'Create Employee';
  		// frm.tour
    	// .init({ tour_name })
    	// .then(() => frm.tour.start());
	},
	prefered_contact_email: function(frm) {
		frm.events.update_contact(frm);
	},

	personal_email: function(frm) {
		frm.events.update_contact(frm);
	},

	company_email: function(frm) {
		frm.events.update_contact(frm);
	},

	user_id: function(frm) {
		frm.events.update_contact(frm);
	},

	update_contact: function(frm) {
		var prefered_email_fieldname = frappe.model.scrub(frm.doc.prefered_contact_email) || 'user_id';
		frm.set_value("prefered_email",
			frm.fields_dict[prefered_email_fieldname].value);
	},

	status: function(frm) {
		return frm.call({
			method: "deactivate_sales_person",
			args: {
				employee: frm.doc.employee,
				status: frm.doc.status
			}
		});
	},

	create_user: function(frm) {
		if (!frm.doc.prefered_email) {
			frappe.throw(__("Please enter Preferred Contact Email"));
		}
		frappe.call({
			method: "erpnext.setup.doctype.employee.employee.create_user",
			args: {
				employee: frm.doc.name,
				email: frm.doc.prefered_email
			},
			freeze: true,
			freeze_message: __("Creating User..."),
			callback: function (r) {
				frm.reload_doc();
			}
		});
	}
});

cur_frm.cscript = new erpnext.setup.EmployeeController({
	frm: cur_frm
});


// frappe.tour['Employee'] = [
// 	{
// 		fieldname: "first_name",
// 		title: "ชื่อจริง",
// 		description: __("ใส่ชื่อจริงของพนักงาน")
// 	},
// 	{
// 		fieldname: "last_name",
// 		title: "นามสกุล",
// 		description: __("ใส่นามสกุลของพนักงาน")
// 	},
// 	{
// 		fieldname: "nickname",
// 		title: "ชื่อเล่น",
// 		description: __("สามารถใส่ชื่อเล่นของพนักงานได้ (ไม่บังคับ)")
// 	},
// 	{
// 		fieldname: "gender",
// 		title: "เลือกเพศ",
// 		description: __("เลือกเพศของพนักงาน")
// 	},
// 	{
// 		fieldname: "date_of_birth",
// 		title: "วันเกิด",
// 		description: __("เลือกวันเกิดของพนักงาน")
// 	},
// 	{
// 		fieldname: "date_of_joining",
// 		title: "วันที่เข้าร่วมงาน",
// 		description: __("เลือกวันที่พนักงานเริ่มทำงานวันแรก")
// 	},
// 	{
// 		fieldname: "status",
// 		title: "สถานะพนักงาน",
// 		description: __("เลือกสถานะพนักงานหากเป็นการเพิ่มพนักงานใหม่ให้เปิดใช้งาน")
// 	},
// 	{
// 		fieldname: "company_details_section",
// 		title: "ข้อมูลตำแหน่งงานในบริษัท",
// 		description: __("สามารถใส่รายละเอียดตำแหน่งงานของพนักงานเพิ่มเติมได้ในส่วนนี้")
// 	},
// 	{
// 		fieldname: "holiday_list",
// 		title: "วันหยุดพื้นฐาน",
// 		description: __("กรุณาใส่วันหยุดพื้นฐานของพนักงาน หากยังไม่ได้ตั้งค่าวันหยุดกรุณาตั้งค่าก่อน")
// 	},
// 	{
// 		fieldname: "salary_mode",
// 		title: "วิธีการจ่ายเงินเดือน",
// 		description: __("เลือกวิธีการจ่ายเงินเดือน")
// 	}
// ];
