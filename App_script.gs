// function doPost(e) {
//   const data = JSON.parse(e.postData.contents);
//   const username = data.username;
//   const password = data.password;

//   const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName("Admins");
//   const rows = sheet.getDataRange().getValues();

//   for (let i = 1; i < rows.length; i++) {
//     if (rows[i][0] === username && rows[i][1] === password) {
//       return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
//         .setMimeType(ContentService.MimeType.JSON);
//     }
//   }

//   return ContentService.createTextOutput(JSON.stringify({ status: "failed" }))
//     .setMimeType(ContentService.MimeType.JSON);
// }


function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  switch (action) {
    case "login":
      return handleLogin(data);
    case "getQuestions":
      return handleGetQuestions(data);
    case "submitAnswers":
      return handleSubmitAnswers(data);
    case "getUserStats":
      return handleGetUserStats();
    case "submitSingleAnswer":
      return handleSingleAnswer(data);
    case 'getOnlineQuestions':
      return handleOnlineQuestions();
    case "storetime":  // ✅ New action added
      return storeTime(data);
    case "getQuizTime": // 🆕 new action
      return getQuizTime(); 
    case "updatePickedAns":
      return updatePickedAns(data); // ✅ Corrected here
    // Future actions can be added here
    // case "addQuestion":
    //   return handleAddQuestion(data);

    default:
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid action" }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}
function getQuizTime() {
  const sheetId = '1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I';
  const sheetName = 'QuizTimes';
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "QuizTimes sheet not found"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "No time data found"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const lastRow = data[data.length - 1];
  const result = {
    timestamp: lastRow[0],
    start: lastRow[1],
    end: lastRow[2],
  };

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    time: result
  })).setMimeType(ContentService.MimeType.JSON);
}

function storeTime(data) {
  const sheetId = '1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I';
  const sheetName = "QuizTimes";
  const ss = SpreadsheetApp.openById(sheetId);
  let sheet = ss.getSheetByName(sheetName);

  // Create sheet and header if not exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Start", "End"]); // Header row
  }

  const { timestamp, start, end } = data;
  sheet.getRange(2, 1, 1, 3).setValues([[timestamp, start, end]]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                       .setMimeType(ContentService.MimeType.JSON);
}



function handleLogin(data) {
  const username = data.username;
  const password = data.password;

  const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName("Admins");
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username && rows[i][1] === password) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "failed" }))
    .setMimeType(ContentService.MimeType.JSON);
}


function handleGetQuestions(data) {
  const username = data.username;
  const ss = SpreadsheetApp.openById("1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I");

  // Fetch status from submit-status sheet
  const statusSheet = ss.getSheetByName("submit-status");
  const statusData = statusSheet.getDataRange().getValues();
  let status = "pending";

  for (let i = 1; i < statusData.length; i++) {
    if (statusData[i][0] === username) {
      status = statusData[i][1];
      break;
    }
  }

  try {
    const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName(username);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: `No sheet found for user: ${username}`
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const questionRows = values.slice(1);

    const questions = questionRows.map(row => {
      return {
        id: row[0],
        text: row[1],
        options: {
          A: row[2],
          B: row[3],
          C: row[4],
          D: row[5],
        },
        correctAnswer: row[6],
        explanation: row[7],
        category: row[8],
        difficulty: row[9],
        picked: row[10],
      };
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      questions: questions,
      substatus: status
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}



function handleSubmitAnswers(data) {
  const username = data.username;
  const answers = data.answers; // Array of { id, picked }

  const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName(username);
  const statusSheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName('submit-status');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "User sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("Question ID");
  let pickedIndex = headers.indexOf("Picked_Ans");

  // Create Picked_Ans column if missing
  if (pickedIndex === -1) {
    sheet.getRange(1, headers.length + 1).setValue("Picked_Ans");
    pickedIndex = headers.length;
  }

  const idToRow = {};
  for (let i = 1; i < values.length; i++) {
    const questionId = values[i][idIndex];
    idToRow[questionId] = i + 1; // Row index in the sheet (1-based)
  }

  answers.forEach(ans => {
    const row = idToRow[ans.id];
    if (row) {
      sheet.getRange(row, pickedIndex + 1).setValue(ans.picked);
    }
  });

  const info = statusSheet.getDataRange().getValues();
  const headerboy = info[0];
  const usernameCol = headerboy.indexOf("username");
  const statusCol = headerboy.indexOf("status");



  for (let i = 1; i < info.length; i++) {
    if (info[i][usernameCol] === username) {
      statusSheet.getRange(i + 1, statusCol + 1).setValue("submitted");
      break;
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}


function handleGetUserStats() {
  const ss = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I');
  const sheets = ss.getSheets();
  const stats = [];

  sheets.forEach(sheet => {
    const name = sheet.getName();
    const skipSheets = ["Admins", "Online"];

    if (skipSheets.includes(name)) return; // Skip sheets in the list

    const values = sheet.getDataRange().getValues();
    if (!values.length) return;

    const headers = values[0];
    const correctCol = headers.indexOf("Correct Answer");
    const pickedCol = headers.indexOf("Picked_Ans");

    if (correctCol === -1 || pickedCol === -1) return;

    let correct = 0;
    let all = 0;
    let attempt = 0;

    for (let i = 1; i < values.length; i++) {
      const correctAns = values[i][correctCol];
      const picked = values[i][pickedCol];
      if (picked !== "") {
        attempt++;
      }
      all++;
      if (picked === correctAns) correct++;

    }

    const wrong = all - correct;
    const score = all > 0 ? Math.round((correct / all) * 100) : 0;

    stats.push({
      user: name,
      attempt,
      all,
      correct,
      wrong,
      score
    });
  });

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    stats
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSingleAnswer(data) {
  const username = data.username;
  const answer = data.answers[0]; // Only one answer expected
  const questionId = answer.id;
  const picked = answer.picked;

  const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName(username);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "User sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("Question ID");
  let pickedIndex = headers.indexOf("Picked_Ans");

  // Create Picked_Ans column if missing
  if (pickedIndex === -1) {
    sheet.getRange(1, headers.length + 1).setValue("Picked_Ans");
    pickedIndex = headers.length;
  }

  for (let i = 1; i < values.length; i++) {
    const rowId = values[i][idIndex];
    if (rowId == questionId) {
      sheet.getRange(i + 1, pickedIndex + 1).setValue(picked);
      break;
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}


// New handler for loading all Online sheet questions with no parameter
function handleOnlineQuestions() {
  const sheetName = "Online";
  const ss = SpreadsheetApp.openById("1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I");
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Sheet not found' })).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // first row headers
  const questions = data.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', questions: questions })).setMimeType(ContentService.MimeType.JSON);
}



function updatePickedAns(params) {
  const questionId = params.questionId;
  const pickedAns = params.pickedAns;

  if (!questionId || !pickedAns) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Missing questionId or pickedAns' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.openById("1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I");
  const sheet = ss.getSheetByName("Online");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const questionIdCol = headers.indexOf("Question ID");
  const pickedAnsCol = headers.indexOf("Picked_Ans");

  if (questionIdCol === -1 || pickedAnsCol === -1) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Required columns not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let rowToUpdate = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][questionIdCol]) === String(questionId)) {
      rowToUpdate = i + 1;
      break;
    }
  }

  if (rowToUpdate === -1) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Question ID not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.getRange(rowToUpdate, pickedAnsCol + 1).setValue(pickedAns);

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Picked answer updated' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// function handleAutoSaveAnswer(data) {
//   const { username, questionId, pickedAns } = data;

//   const sheet = SpreadsheetApp.openById('1_si663AVBrE35oiIgiMLepR7wuyyL_fiMmynGx-Vt5I').getSheetByName(username);
//   const values = sheet.getDataRange().getValues();

//   const questionIdIndex = values[0].indexOf("Question ID");
//   const pickedAnsIndex = values[0].indexOf("Picked_Ans");

//   for (let i = 1; i < values.length; i++) {
//     if (String(values[i][questionIdIndex]) === String(questionId)) {
//       sheet.getRange(i + 1, pickedAnsIndex + 1).setValue(pickedAns);
//       break;
//     }
//   }

//   return ContentService.createTextOutput(JSON.stringify({ status: "saved" }))
//     .setMimeType(ContentService.MimeType.JSON);
// }



