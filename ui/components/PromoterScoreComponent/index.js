import React     from 'react';
import PropTypes from 'prop-types';
import styles    from './styles.scss';

const PromoterScoreComponent = (props) => {
    const {
        npsScore,
        npsDetractors,
        npsPassives,
        npsPromoters,
    } = props;
    const totalVotes = npsDetractors + npsPassives + npsPromoters;
    /* eslint-disable max-len */
    return (
        <div className={ styles.promoterBox }>
            <div className={ styles.progressBar }>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="30 25 240 140"
                >
                    <path
                        fill={ styles.detractor }
                        d="M 33.125 147.49999999999997 A 116.875 116.875 0 0 1 91.46131781318243 46.341765966231065 L 120.73065890659122 96.92088298311553 A 58.4375 58.4375 0 0 0 91.5625 147.5 Z"
                    />
                    <path
                        fill={ styles.passive }
                        d="M 91.56250529969515 46.2832778729135 A 116.875 116.875 0 0 1 208.33624877630237 46.22489099630967 L 179.1681243881512 96.86244549815484 A 58.4375 58.4375 0 0 0 120.78125264984757 96.89163893645676 Z"
                    />
                    <path
                        fill={ styles.promoter }
                        d="M 208.4374947003049 46.283277872913544 A 116.875 116.875 0 0 1 266.8749415625049 147.38312501947922 L 208.43747078125244 147.4415625097396 A 58.4375 58.4375 0 0 0 179.21874735015246 96.89163893645677 Z"
                    />
                    <g
                        transform="translate(10,10) scale(1 1)"
                    >
                        <path
                            fill="#000000"
                            d="M 58.4375 -2.5 L 81.8125 -2.5 116.875 -2.5 116.875 2.5 81.8125 2.5 58.4375 2.5 z"
                            transform={ `translate(140,137.5) rotate(${ -180 + 180 * (npsScore + 100) / 200 } 0 0)` }
                        />
                    </g>
                    <text
                        x="39"
                        y="157.5"
                    >
                        -100
                    </text>
                    <text
                        x="85.03456447848595"
                        y="92"
                    >
                        -50
                    </text>
                    <text
                        x="147"
                        y="65.625"
                    >
                        0
                    </text>
                    <text
                        x="200"
                        y="92"
                    >
                        50
                    </text>
                    <text
                        x="241.875"
                        y="157.50000000000003"
                    >
                        100
                    </text>
                </svg>
                <div className={ styles.score }>
                    <span className={ styles.scoreNumber }>
                    { npsScore.toFixed(0) }
                    </span>
                    <span className={ styles.scoreText }>
                        NPS
                    </span>
                </div>
            </div>
            { totalVotes ? <div className={ styles.additionalInfo }>
                <span className={ styles.promoterText }>
                    Promoters { npsPromoters } ({ (100 * npsPromoters / totalVotes).toFixed(0) }%)
                </span>
                <span className={ styles.passiveText }>
                    Passives { npsPassives } ({ (100 * npsPassives / totalVotes).toFixed(0) }%)
                </span>
                <span className={ styles.detractorText }>
                    Detractors { npsDetractors } ({ (100 * npsDetractors / totalVotes).toFixed(0) }%)
                </span>
            </div> : <div className={ styles.additionalInfo }>
                You currently have no respondents
            </div> }
        </div>
    );
    /* eslint-enable max-len */
};

PromoterScoreComponent.propTypes = {
    npsScore: PropTypes.number,
    npsDetractors: PropTypes.number,
    npsPassives: PropTypes.number,
    npsPromoters: PropTypes.number,
};

export default PromoterScoreComponent;
