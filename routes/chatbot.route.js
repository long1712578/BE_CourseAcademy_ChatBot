const express = require('express');
const request = require('request');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const router = express.Router();

const DEFAULT_VERIFY_TOKEN = 'nttung';
const PAGE_ACCESS_TOKEN = "EAADPi4f7imIBAHZA2R1puU3V9ncbfZBytG4cvJ018L67hIPKFNQmXuoikJrnpSbZCmUxedi3K98maX3vIDFlWZATdL6zSyX5A5HZCittgEjpFSWZAZBQGWr88gjZCcZBjABLJuE88ZAsGZBtIKXelSFJEsgr4wwhGBjgqAtTYQe2ZCgUVFRe3NL4BxCz";
const KEYWORD_SEARCH = ['category', 'EIFS', 'Casework', 'Span', 'it'];

// Creates the endpoint for our webhook 
router.post('/', (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log('Webhook event: ' + webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Adds support for GET requests to our webhook
router.get('/', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = DEFAULT_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Handles messages events
async function handleMessage(sender_psid, received_message) {
    // handle postback quick reply
    if (received_message && received_message.quick_reply && received_message.quick_reply.payload) {
        let payload = received_message.quick_reply.payload;
        console.log(payload);
        if (payload.includes('KEYWORD_SEARCH')) {
            const keyword = payload.split('_').slice(-1)[0];
            console.log(keyword);
            await sendCourseList(sender_psid, { limit: 1, search: keyword });
        }
        return;
    }

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        if (received_message.text === '/start') {
            await sendResponseWelcomeUser(sender_psid);
        } else if (received_message.text === '/menu') {
            await sendMainMenu(sender_psid);
        }

    } else if (received_message.attachments) {
        let response;
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
        // Send the response message
        callSendAPI(sender_psid, response);
    }

}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
    console.log(payload);

    // Set the response based on the postback payload
    switch (payload) {
        case 'RESTART':
            await sendResponseWelcomeUser(sender_psid);
            break;
        case 'MAIN_MENU':
            await sendMainMenu(sender_psid);
            break;
        case 'BACK_TO_MAIN_MENU':
            await sendMainMenu(sender_psid);
            break;
        case 'COURSE_LIST':
            await sendCourseList(sender_psid, { limit: 10 });
            break;
        case 'CATEGORIES':
            await sendCategories(sender_psid);
            break;
        case 'BACK_TO_CATEGORIES':
            await sendCategories(sender_psid);
            break;
        case 'SEARCH_COURSE_BY_KEYWORD':
            await sendFormSearchByKeyword(sender_psid);
            break;
        case 'yes':
            response = { "text": "Thanks!" }
            callSendAPI(sender_psid, response);
            break;
        case 'no':
            response = { "text": "Oops, try sending another image." }
            callSendAPI(sender_psid, response);
            break;
        default:
            if (payload.includes('COURSE_LIST_BY_CATEGORY_ID')) {
                const categoryId = +payload.split('_').slice(-1)[0];
                await sendCourseList(sender_psid, { limit: 10, category_id: categoryId });
                break;
            } else if (payload.includes('DETAIL_COURSE')) {
                const courseId = +payload.split('_').slice(-1)[0];
                await sendDetailCourse(sender_psid, courseId);
                break;
            }


    }

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

const sendResponseWelcomeUser = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let rspWelcome, rspMenu;
            rspWelcome = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://media2.giphy.com/media/OF0yOAufcWLfi/giphy.gif?cid=ecf05e47cdbf04565acc041633c39c5143828c34c09608f7&rid=giphy.gif"
                    }
                }
            }

            rspMenu = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": 'Welcome to Course Academy',
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Show menu",
                                "payload": "MAIN_MENU"
                            },
                            {
                                "type": "postback",
                                "title": "Restart conversation",
                                "payload": "RESTART",
                            }
                        ]
                    }
                }
            }
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, rspWelcome);

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, rspMenu);

            resolve("done!")
        } catch (e) {
            reject(e);
        }

    });
};

const sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "messaging_type": "RESPONSE",
                "message": response,
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(res)
                console.log(body)
                if (!err) {
                    console.log("message sent!");
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};



const sendMainMenu = (sender_psid) => {
    return new Promise((resolve, reject) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": 'Main menu',
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Course list",
                                    "payload": "COURSE_LIST"
                                },
                                {
                                    "type": "postback",
                                    "title": "Categories",
                                    "payload": "CATEGORIES",
                                },
                                {
                                    "type": "postback",
                                    "title": "Search course by keyword",
                                    "payload": "SEARCH_COURSE_BY_KEYWORD",
                                }
                            ]
                        }
                    }
                }

                await sendTypingOn(sender_psid);
                await sendMessage(sender_psid, response);
                resolve("done");
            } catch (e) {
                reject(e);
            }
        });
    })
}

const sendTypingOn = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action": "typing_on"
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

const sendCategories = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await categoryModel.all({ limit: 10 });
            console.log(categories);
            const categoriesTemplate = categories.map((el) => {
                return {
                    "title": el.name,
                    "image_url": "https://tinyurl.com/categoryImage",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "View course list",
                            "payload": `COURSE_LIST_BY_CATEGORY_ID_${el.id}`,
                        },
                        {
                            "type": "postback",
                            "title": "Main menu",
                            "payload": "BACK_TO_MAIN_MENU"
                        }
                    ]
                }
            })
            const response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": categoriesTemplate
                    }
                }
            }

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    })
}

const sendCourseList = (sender_psid, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response;

            const rs = await courseModel.all(filter);
            if (rs.length > 0) {
                const coursesTemplate = rs.courses.map((el) => {
                    let course = el['course'];
                    return {
                        "title": course.name,
                        "image_url": course.image || "https://tinyurl.com/imageCourse",
                        "subtitle": course.price.toString(),

                        "buttons": [
                            {
                                "type": "postback",
                                "title": "View detail",
                                "payload": `DETAIL_COURSE_${course.id}`,
                            },
                            {
                                "type": "postback",
                                "title": "Back to categories",
                                "payload": "BACK_TO_CATEGORIES"
                            },
                            {
                                "type": "postback",
                                "title": "Main menu",
                                "payload": "BACK_TO_MAIN_MENU"
                            }
                        ]
                    }
                })
                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": coursesTemplate
                        }
                    }
                }
            } else {
                response = { "text": "No course was found!!" }
            }

            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

const sendDetailCourse = (sender_psid, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const course = await courseModel.single(id);
            const img = course.image || "https://tinyurl.com/imageCourse";
            const response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": `Name: ${course.name}`,
                                "image_url": img,
                                "subtitle": `Price: ${course.price}\nView: ${course.view}\nRating: ${course.rating_average}`,
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "Back to list",
                                        "payload": `COURSE_LIST_BY_CATEGORY_ID_${course.category_id}`
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Main menu",
                                        "payload": "BACK_TO_MAIN_MENU"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

}

const sendFormSearchByKeyword = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const keywords = KEYWORD_SEARCH;
            const replies = keywords.map((el) => {
                return {
                    "content_type": "text",
                    "title": el,
                    "payload": `KEYWORD_SEARCH_${el}`,
                }
            });
            const response = {
                "text": "Whick keyword do you want to use to searching courses?",
                "quick_replies": replies
            }
            await sendTypingOn(sender_psid);
            await sendMessage(sender_psid, response);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

}

module.exports = router;