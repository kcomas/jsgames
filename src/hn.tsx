import React, { useId, useEffect, useReducer } from "react";
import "./hn.css";

const hnUrl = window.location.protocol + "//hacker-news.firebaseio.com/v0/";

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
    url?: string;
}

interface Props {
    maxItems: number;
    maxItemsPerPage: number;
}

interface State {
    loading: boolean;
    er: string;
    curHnEndPt: HnUrlEndPts;
    page: number;
    items: HnItem[];
}

enum Action {
    SetLoading,
    SetEndPt,
    SetItems,
    IncPage,
    DecPage,
}

function reducer(
    state: State,
    action: { type: Action; data?: Partial<State> }
) {
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
            state.loading = false;
            state.items = data?.items ?? [];
            break;
        case Action.IncPage:
            state.page++;
            break;
        case Action.DecPage:
            if (state.page > 1) state.page--;
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

function HN({ maxItems, maxItemsPerPage }: Props) {
    const [state, dispatch] = useReducer(reducer, {
        loading: true,
        er: "",
        curHnEndPt: HnUrlEndPts.TopStories,
        page: 1,
        items: [],
    });

    const printItems = () => {
        return state.items
            .slice(
                state.page * maxItemsPerPage,
                state.page * maxItemsPerPage + maxItemsPerPage
            )
            .map((item) => (
                <h4>
                    <a href={item.url} target="_blank" key={item.id}>
                        {item.title}
                    </a>
                </h4>
            ));
    };

    useEffect(() => {
        const fetchEndPt = async () => {
            try {
                dispatch({ type: Action.SetLoading, data: { loading: true } });
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
        fetchEndPt();
    }, [state.curHnEndPt, maxItems]);

    let bodyJSX = (
        <>
            <h2>Loading {state.curHnEndPt}</h2>
            <div className="hn-loading"></div>
        </>
    );

    const incPage = () => {
        if (state.page * maxItemsPerPage < state.items.length)
            dispatch({ type: Action.IncPage });
    };

    if (state.er) {
        bodyJSX = <h2 className="hn-er">{state.er}</h2>;
    } else if (!state.loading) {
        bodyJSX = (
            <>
                {printItems()}
                <div className="hn-page">
                    <button onClick={() => dispatch({ type: Action.DecPage })}>
                        {"<<<<<"}
                    </button>
                    <span className="hn-page-num">{state.page}</span>
                    <button onClick={incPage}>{">>>>>"}</button>
                </div>
            </>
        );
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
