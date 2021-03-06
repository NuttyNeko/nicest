'use strict';

/**
 * @module import-export/task/import-teams
 */

const Team = require('../../team/model/team');

/**
 * Adds Teams to Mongoose
 * @param {Object} documentAndMapping - XML document and User ObjectId mappings
 * @returns {Object} XML Document, User ObjectId mapping, and Team ObjectId mapping
 */
function importTeams (documentAndMapping) {
    // find all the teams
    const teams = documentAndMapping
        .document
        .find('//team');
    const promises = [];

    // for each team
    for (const currentTeam of teams) {
        // gather all team members for current team
        const teamMembers = currentTeam.find('member');
        const teamMetadata = {members: []};

        // set the team name
        teamMetadata.name = currentTeam
            .get('name')
            .text();

        // get each of the team members' ids
        for (const member of teamMembers) {
            const memberXmlId = member
                .attr('id')
                .value();
            const memberMongoId = documentAndMapping
                .mapping
                .find((element) => element.xmlId === memberXmlId)
                .databaseId;

            teamMetadata
                .members
                .push(memberMongoId);
        }

        // copy the team to Mongoose
        promises.push(
            Team
                .create(teamMetadata)
                .then((newTeam) => ({
                    databaseId: newTeam._id,
                    xmlId: currentTeam
                        .attr('id')
                        .value()
                }))
        );
    }

    // wait for all teams to be created
    return Promise
        .all(promises)
        .then((newResult) => {
            documentAndMapping.mapping = documentAndMapping
                .mapping
                .concat(newResult);

            return documentAndMapping;
        });
}

module.exports = importTeams;
