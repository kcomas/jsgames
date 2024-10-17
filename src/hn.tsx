import React, { useEffect, useReducer } from "react";

const hnUrl = window.location.protocol + "//hacker-news.firebaseio.com/v0/";

const maxItems = 20;

enum HnUrlEndPts {
    TopStories = "topstories",
    NewStories = "newstories",
    BestStories = "beststories",
}

function getEndPt(endpt: HnUrlEndPts) {
    return hnUrl + endpt;
}

function getItm(id: number) {
    return hnUrl + `item/${id}.json`;
}

interface HnItem {
    id: number;
}

interface State {
    er: string;
    curHnEndPt: HnUrlEndPts;
    items: any[];
}

enum Action {
    SetItems,
}

function reducer(state: State, action: { type: Action; data: Partial<State> }) {
    state = { ...state };
    const { type, data } = action;
    switch (type) {
        case Action.SetItems:
            state.items = data?.items ?? [];
    }
    return state;
}

async function fetchHNItem(id: number) {
    try {
        const res = await fetch(getItm(id));
        return await res.json();
    } catch (er) {
        // TODO
    }
}

function HN() {
    const [state, dispatch] = useReducer(reducer, {
        er: "",
        curHnEndPt: HnUrlEndPts.TopStories,
        items: [],
    });

    const fetchEndPt = async () => {
        try {
            const res = await fetch(getEndPt(state.curHnEndPt) + ".json");
            const itemIds = (await res.json()) as number[];
            const items = await Promise.all(
                itemIds.slice(0, maxItems).map((id) => fetchHNItem(id))
            );
            dispatch({ type: Action.SetItems, data: { items } });
        } catch (er) {
            // TODO dispatch
        }
    };

    const printItems = () => {
        return state.items.map((item) => <p key={item.id}>{item.title}</p>);
    };

    useEffect(() => {
        fetchEndPt();
    }, []);

    return <div>{printItems()}</div>;
}

export default HN;
