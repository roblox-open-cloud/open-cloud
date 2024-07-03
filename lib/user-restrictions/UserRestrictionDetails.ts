import type { UserRestrictionResource, GameJoinRestrictionDetails } from '@roblox-open-cloud/api-types/v2';
import type UserRestrictions from '#lib/user-restrictions/UserRestrictions';

export default class UserRestrictionDetails {
    /** The context that created this class. */
    private readonly context: UserRestrictions;

    /** An automatically parsed universeId from the restriction response path. */
    public readonly universeId: number;
    /** An automatically parsed userId from the restriction response user. */
    public readonly userId: number;
    /** Whether or not the restriction is currently active. */
    public readonly active: boolean;
    /** The time that the restriction was applied. */
    public readonly startTime: Date;
    /** The time that the restriction details were last updated. */
    public readonly lastUpdated: Date;
    /** The duration that the restriction will last. */
    public readonly duration: string | undefined;
    /** An internal reason about the restriction that is not shown to the user. */
    public readonly privateReason: string;
    /** A front-facing reason about the restriction that is shown to the user. */
    public readonly displayReason: string;
    /** Whether or not any alt accounts will be restricted as well. */
    public readonly excludeAltAccounts: boolean;
    /** Whether or not the restriction has been inherited from another place on the universe. */
    public readonly inherited: boolean;

    /**
     * @param context What originally initated this class.
     * @param restrictionDetails Details about the restriction.
     */
    constructor(context: UserRestrictions, restrictionDetails: UserRestrictionResource) {
        this.context = context;

        this.universeId = parseInt(restrictionDetails.path.split('/')[1]);
        this.userId = parseInt(restrictionDetails.user.split('/')[1]);
        this.lastUpdated = restrictionDetails.updateTime ? new Date(restrictionDetails.updateTime) : new Date();

        for (const [k, v] of Object.entries(restrictionDetails.gameJoinRestriction)) {
            if (k === 'startTime') {
                this[k] = v ? new Date(v) : new Date();
                continue;
            }

            this[k] = v;
        }
    }

    public async updateRestriction(gameJoinRestriction: Partial<GameJoinRestrictionDetails>) {
        return this.context.updateUserRestriction(this.universeId.toString(), this.userId.toString(), gameJoinRestriction);
    }
}