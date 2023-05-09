import nodemailer from "nodemailer";

const sendSimpleEmail = async (dataSend) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_APP, // generated ethereal user
			pass: process.env.EMAIL_APP_PASSWORD, // generated eethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"tin phan cr7 👻" <foo@example.com>', // sender address
		to: dataSend?.receivedEmail, // list of receivers
		subject: "Thông tin đặt lịch khám bệnh:", // Subject line
		text: "Hello world?", // plain text body
		html: emailBodyHtml(dataSend), // html body
	});
};

const emailBodyHtml = (dataSend) => {
	let result =
		dataSend?.language === "vi"
			? `
    <h3>Xin chào ${dataSend?.patientName}!</h3>
    <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh tại website của chúng tôi.</p>
    <p>Thông tin đặt lịch của bạn như sau:</p>
    <p><b>Thời gian: ${dataSend?.timeString}</b></p>
    <div><b>Bác sĩ: ${dataSend?.doctorName}</b></div>
    <p>Nếu thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận  và hoàn tất thủ tục khám bệnh</p>
    <div>
        <a href="${dataSend?.redirectLink}" target="_blank">Xác nhận đặt lịch</a>
    </div>
    <p>Trân trọng!</p>

    `
			: `
   <h3>Hello ${dataSend?.patientName}!</h3>
    <p>You are receiving this email because you have scheduled a medical examination on our website.</p>
    <p>Your appointment information is as follows:</p>
    <p><b>Time: ${dataSend?.time}</b></p>
    <div><b>Doctor: ${dataSend?.doctorName}</b></div>
    <p>If the above information is correct, please click on the link below to confirm and complete the medical examination procedure.</p>
    <div>
        <a href="${dataSend?.redirectLink}" target="_blank">Confirm Appointment</a>
    </div>
    <p>Thank you!</p>

    `;
	return result;
};

const sendRemedyEmail = async (dataSend) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_APP, // generated ethereal user
			pass: process.env.EMAIL_APP_PASSWORD, // generated eethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"tin phan cr7 👻" <foo@example.com>', // sender address
		to: dataSend?.email, // list of receivers
		subject: "Thông tin đặt lịch khám bệnh:", // Subject line
		html: remedyBodyHtml(dataSend), // html body
		attachments: [
			{
				filename: `remedy-${dataSend?.patientId}-${dataSend?.patientName}.png`,
				content: dataSend?.image.split("base64,")[1],
				encoding: "base64",
			},
		],
	});
};

const remedyBodyHtml = (dataSend) => {
	let result =
		dataSend?.lang === "vi"
			? `
    <h3>Xin chào ${dataSend?.patientName}!</h3>
    <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh tại website của chúng tôi.</p>
    <p>Nếu thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận  và hoàn tất thủ tục khám bệnh</p>
   
    <p>Trân trọng!</p>

    `
			: `
   <h3>Hello ${dataSend?.patientName}!</h3>
    <p>You are receiving this email because you have scheduled a medical examination on our website.</p>

    <p>If the above information is correct, please click on the link below to confirm and complete the medical examination procedure.</p>
   
    <p>Thank you!</p>

    `;
	return result;
};

export {sendRemedyEmail, sendSimpleEmail};
