import React from "react";
import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Card, CardBody, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Colors from "../../Styles/Colors";

const StatCard = ({ stat }) => (
  <Card className="shadow-md p-4 rounded-2xl border">
    <CardBody className="flex items-center space-x-4">
      <div className={`w-16 h-16 flex items-center justify-center ${stat.bgColor} rounded-xl text-white`}>
        <Icon as={stat.icon} boxSize={10} />
      </div>
      <Stat>
        <StatLabel className="text-sm" style={{ color: Colors.smokyGray }}>
          {stat.title}
        </StatLabel>
        <StatNumber className="text-xl font-bold">{stat.value}</StatNumber>
        <StatHelpText className={`text-sm flex items-center ${stat.positive ? "text-green-500" : "text-red-500"}`}>
          <StatArrow type={stat.positive ? "increase" : "decrease"} />
          {stat.change} {stat.changeText}
        </StatHelpText>
      </Stat>
    </CardBody>
  </Card>
);

StatCard.propTypes = {
  stat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
    positive: PropTypes.bool.isRequired,
    icon: PropTypes.elementType.isRequired,
    bgColor: PropTypes.string.isRequired,
    changeText: PropTypes.string.isRequired,
  }).isRequired,
};

export default StatCard;