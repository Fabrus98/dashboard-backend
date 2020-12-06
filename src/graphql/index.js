const {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, graphqlSync, GraphQLSchema, GraphQLEnumType,
} = require('graphql');

const { getUserGuilds, getBotGuilds, getGuildRoles} = require('../utils/api');
const { getMutualGuilds } = require('../utils/utils');
const GuildConfig = require('../database/schemas/ServerConfig');

const GuildType = new GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        icon: { type: GraphQLString },
        owner: { type: GraphQLBoolean },
        permissions: { type: GraphQLInt },
        features: { type: new GraphQLList(GraphQLString) },
        permissions_new: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discordTag: { type: GraphQLString },
        discordId: { type: GraphQLString },
        avatar: { type: GraphQLString },
        guilds: {
            type: new GraphQLList(GuildType),
            resolve(parent, args, request) {
                return request.user ? getUserGuilds(request.user.discordId) : null;
            }
        }
    })
});

const MutualGuildType = new GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () => ({
        excluded: { type: new GraphQLList(GuildType) },
        included: { type: new GraphQLList(GuildType) },
    })
});

const GuildConfigType = new GraphQLObjectType({
    name: 'GuildConfigType',
    fields: () => ({
        guildId: { type: GraphQLString },
        serverName: { type: GraphQLString },
        prefix: { type: GraphQLString },
        ruoloStandardID: { type: GraphQLString },
        ruoloMutedID: { type: GraphQLString },
        ruoliAssegnabili: { type: new GraphQLList(GraphQLString) },
        logChannelID: { type: GraphQLString },
        minorLogChannelID: { type: GraphQLString },
        globalLogChannelID: { type: GraphQLString },
        reportChannelID: { type: GraphQLString },
        adminTrackerValue: { type: GraphQLInt },
        unmuteTime: { type: GraphQLInt },
    })
});

const GuildRoleType = new GraphQLObjectType({
    name: 'GuildRoleType',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        color: { type: GraphQLInt },
        hoist: { type: GraphQLBoolean },
        position: { type: GraphQLInt },
        permissions: { type: GraphQLInt },
        permissions_new: { type: GraphQLString },
        managed: { type: GraphQLBoolean },
        mentionable: { type: GraphQLBoolean },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser: {
            type: UserType,
            resolve(parent, args, request) {
                return request.user ? request.user : null;
            }
        },
        getMutualGuilds: {
            type: MutualGuildType,
            async resolve(parent, args, request) {
                if(request.user) {
                    const botGuilds = await getBotGuilds();
                    const userGuilds = await getUserGuilds(request.user.discordId);
                    return getMutualGuilds(userGuilds, botGuilds);
                } return null;
            }
        },
        getGuildConfig: {
            type: GuildConfigType,
            args: {
                guildId: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const { guildId } = args;
                if(!guildId || !request.user) return null;
                const config = await GuildConfig.findOne({ guildId });
                return config ? config : null;
            }
        },
        getGuildRoles: {
            type: new GraphQLList(GuildRoleType),
            args: {
                guildId: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const { guildId } = args;
                if(!guildId || !request.user) return null;
                return getGuildRoles(guildId);
            }
        }
    }
});

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildPrefix: {
            type: GuildConfigType,
            args: {
                guildId: { type: GraphQLString },
                prefix: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const { guildId, prefix } = args;
                if(!guildId || !prefix || !request.user) return null;
                const config = await GuildConfig.findOneAndUpdate({ guildId }, { prefix }, { new: true });
                return config ? config : null;
            }
        },
        updateRuoloMutedID: {
            type: GuildConfigType,
            args: {
                guildId: { type: GraphQLString },
                ruoloMutedID: { type: GraphQLString },
            },
            async resolve(parent, args, request) {
                const { guildId, ruoloMutedID } = args;
                if(!guildId || !ruoloMutedID || !request.user) return null;
                const config = await GuildConfig.findOneAndUpdate({ guildId }, { ruoloMutedID }, { new: true });
                return config ? config : null;
            }
        },
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: MutationQuery });