import React, { useId, useEffect, useReducer } from "react";
import "./hn.css";

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

interface HnItem {
    id: number;
    title?: string;
}

interface State {
    loading: boolean;
    er: string;
    curHnEndPt: HnUrlEndPts;
    items: HnItem[];
}

enum Action {
    SetLoading,
    SetEndPt,
    SetItems,
}

function reducer(state: State, action: { type: Action; data: Partial<State> }) {
    state = { ...state };
    const { type, data } = action;
    switch (type) {
        case Action.SetLoading:
            state.loading = data?.loading ?? true;
            break;
        case Action.SetEndPt:
            state.curHnEndPt = data?.curHnEndPt ?? HnUrlEndPts.TopStories;
            break;
        case Action.SetItems:
            state.items = data?.items ?? [];
            break;
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
        loading: true,
        er: "",
        curHnEndPt: HnUrlEndPts.TopStories,
        items: [],
    });

    const fetchEndPt = async () => {
        try {
            dispatch({ type: Action.SetLoading, data: { loading: true } });
            const res = await fetch(getEndPt(state.curHnEndPt) + ".json");
            const itemIds = (await res.json()) as number[];
            const items = await Promise.all(
                itemIds.slice(0, maxItems).map((id) => fetchHNItem(id))
            );
            dispatch({ type: Action.SetItems, data: { items } });
            dispatch({ type: Action.SetLoading, data: { loading: false } });
        } catch (er) {
            // TODO dispatch
        }
    };

    const printItems = () => {
        return state.items.map((item) => <p key={item.id}>{item.title}</p>);
    };

    useEffect(() => {
        fetchEndPt();
    }, [state.curHnEndPt]);

    let bodyJSX = (
        <>
            <h2>Loading {state.curHnEndPt}</h2>
            <div className="hn-loading"></div>
        </>
    );

    if (state.er) {
        bodyJSX = <h2 className="hn-er">{state.er}</h2>;
    } else if (!state.loading) {
        bodyJSX = <>{printItems()}</>;
    }

    const selectId = useId();

    return (
        <div>
            <label htmlFor={selectId}>HN Feed: {state.curHnEndPt}</label>
            <select
                id={selectId}
                value={state.curHnEndPt}
                onChange={(e) =>
                    dispatch({
                        type: Action.SetEndPt,
                        data: {
                            curHnEndPt: e.target.value as HnUrlEndPts,
                        },
                    })
                }
            >
                {Object.values(HnUrlEndPts).map((endpt) => (
                    <option key={endpt} value={endpt}>
                        {endpt}
                    </option>
                ))}
            </select>
            {bodyJSX}
        </div>
    );
}

export default HN;
