import type { UserRestrictionResource, UserRestrictionResourceError, GameJoinRestrictionDetails } from '@roblox-open-cloud/api-types/v2';
import UserRestrictionDetails from '#lib/user-restrictions/UserRestrictionDetails';

export default class UserRestrictions {
    /** The API key for the Open Cloud API. */
    protected readonly key: string;

    /**
     * Manage user restrictions for an experience.
     * @param key Your API key. If you are using the same API key, you can set an env variable called OPEN_CLOUD_API_KEY to set it by default.
     */
    constructor(key?: string) {
        this.key = process.env.OPEN_CLOUD_API_KEY || key;

        if (!this.key) {
            throw new Error('No API key was provided for UserRestriction API.');
        }
    }

    /**
     * Get a restriction for a user in the requested place.
     * @param universeId The universe to check information on the user restriction.
     * @param restrictedUserId The user to check a restirction for.
     * @returns {Promise<UserRestrictionDetails | UserRestrictionResourceError>}
     */
    public async getRestriction(universeId: string, restrictedUserId: string): Promise<UserRestrictionDetails | UserRestrictionResourceError> {
        const url = new URL(`/cloud/v2/universes/${universeId}/user-restrictions/${restrictedUserId}`, 'https://apis.roblox.com');

        const request = await fetch(url, {
            headers: { "x-api-key": this.key }
        });
        
        const data = await request.json();

        if (!request.ok)
            return data as UserRestrictionResourceError;

        return new UserRestrictionDetails(this, data as UserRestrictionResource);
    }

    /**
     * Update the restriction information for the user.
     * @param universeId The universe to update the restriction in.
     * @param restrictedUserId The userId to update the restriction for in the universe.
     * @param gameJoinRestriction Details for the game restriction.
     * @returns {Promise<UserRestrictionDetails | UserRestrictionResourceError>}
     */
    public async updateUserRestriction(universeId: string, restrictedUserId: string, gameJoinRestriction: Partial<GameJoinRestrictionDetails>): Promise<UserRestrictionDetails | UserRestrictionResourceError> {
        const url = new URL(`/cloud/v2/universes/${universeId}/user-restrictions/${restrictedUserId}`, 'https://apis.roblox.com');
        // url.searchParams.set('updateMask', Object.keys(gameJoinRestriction).map((v) => `gameJoinRestriction.${v}`).join(','));

        if (gameJoinRestriction?.privateReason?.length > 1000) {
            throw new Error('Private reason is longer than the maximum allowes length, 1000.');
        }

        if (gameJoinRestriction?.displayReason?.length > 400) {
            throw new Error('Private reason is longer than the maximum allowes length, 400.');
        }
        
        const request = await fetch(url, {
            method: 'PATCH',
            headers: {
                "content-type": "application/json",
                "x-api-key": this.key
            },
            body: JSON.stringify({ gameJoinRestriction })
        });

        const data = await request.json();
        
        if (!request.ok)
            return data as UserRestrictionResourceError;

        return new UserRestrictionDetails(this, data as UserRestrictionResource);
    }
}