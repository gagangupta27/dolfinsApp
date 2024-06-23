import { askGPT } from "./gpt";
import { LINKEDIN_TO_SUMMARY_PROMPT } from "./../../prompts";

const getQuickSummary = async (entireLinkedinDump) => {
  const quickSummary2 = await askGPT(
    LINKEDIN_TO_SUMMARY_PROMPT,
    entireLinkedinDump
  );

  return quickSummary2;
};

const getWorkHistory = (profileExp) => {
  const title = profileExp.title;
  const companyName = profileExp.companyName;
  const location = profileExp.location;
  const startYear = profileExp.startYear;
  const endYear = profileExp.endYear;

  const line1 = title + (companyName ? " @ " + companyName : "") + "\n";
  var line2 = location ? location + "\n" : "";
  var line3 = startYear
    ? startYear + (endYear ? " - " + endYear : " - Present") + "\n"
    : "";
  const quickSummary = line1 + line2 + line3;
  return quickSummary;
};

const getWorkHistoryList = (data) => {
  if (!data || !data.position_groups) return "";

  const firstProfileExperiences = data.position_groups
    .filter(
      (group) => group.profile_positions && group.profile_positions.length > 0
    )
    .map((group) => {
      const firstPosition = group.profile_positions[0];

      const allFirstYears = group.profile_positions
        .filter((position) => position.date?.start?.year != null)
        .map((position) => position.date.start.year)
        .sort();
      const allLastYears = group.profile_positions
        .filter((position) => position.date?.end?.year != null)
        .map((position) => position.date.end.year)
        .sort();

      return {
        title: firstPosition.title,
        companyName: firstPosition.company,
        location: firstPosition.location,
        startYear: allFirstYears.length > 0 ? allFirstYears[0] : null,
        endYear:
          allLastYears.length > 0
            ? allLastYears[allLastYears.length - 1]
            : null,
      };
    });

  return firstProfileExperiences.map(getWorkHistory).join("\n\n");
};

const getEducationList = (data) => {
  return data.education
    .map((edu) => {
      const schoolName = edu.school?.name || "";
      const degree = edu.degree_name || "";
      const fieldOfStudy = edu.field_of_study || "";
      const startYear = edu.date?.start?.year || "";
      const endYear = edu.date?.end?.year || "";

      return `${schoolName}\n${
        degree ? `${degree}${fieldOfStudy}\n` : ""
      }${startYear} - ${endYear}\n`;
    })
    .join("\n\n");
};

export { getQuickSummary, getWorkHistoryList, getEducationList };
