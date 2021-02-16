import React, {useState, useEffect} from "react";
import {authService, dbService} from "../fbase";
import {useHistory} from "react-router-dom";

export default ({ userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut()
        history.push("/");
    };

    const onChange = (event) => {
        const { target: { value }} = event;
        setNewDisplayName(value);
    }

    const getMyNweets = async () => {
        const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("CreatedAt", "desc").get();
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
        }
    };

    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onChange}/>
                <input type="submit" value="Update Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};